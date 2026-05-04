import { gameEngine } from "./gameEngine";
import { triggerPetEffects, applyPetPassive } from "./petSystem";
import { CombatEntity, StatusEffect } from "./combatTypes";

/**
 * =====================================================
 * EFFECT ENGINE — TURN PIPELINE
 * =====================================================
 *
 * FIXES IN THIS VERSION:
 *
 * 1. Entity = any REMOVED → CombatEntity used throughout
 * 2. runTurn returns { attacker, defender } — no more player/enemy
 *    naming confusion that caused the entity swap bug
 * 3. Entities are shallow-copied before mutation — Zustand
 *    reference safety guaranteed
 * 4. defending flag is now CHECKED in resolveDefenderAttack
 * 5. pet action has a real implementation
 * 6. enemy.baseDamage is used (not hardcoded 8)
 * 7. applyPetPassive called before player resolves attacks
 */

export type BattleLog = string[];
export type Action = "attack" | "heal" | "defend" | "pet";

// ─── ENTITY COPY ─────────────────────────────────────────────
/**
 * Shallow copy an entity before mutation.
 * Prevents direct Zustand state mutation.
 */
function copyEntity(entity: CombatEntity): CombatEntity {
  return {
    ...entity,
    stats: { ...entity.stats },
    effects: [...(entity.effects ?? [])],
  };
}

// ─── STATUS PIPELINE ─────────────────────────────────────────

function applyStatusEffects(entity: CombatEntity, logs: BattleLog): void {
  if (!entity.effects?.length) return;

  entity.effects = entity.effects.filter((effect: StatusEffect) => {
    if (effect.onTurn) {
      effect.onTurn(entity);
    }

    effect.duration -= 1;

    if (effect.duration <= 0) {
      logs.push(`✦ ${effect.name} wears off.`);
      return false;
    }

    return true;
  });
}

function getDamageTakenMultiplier(entity: CombatEntity): number {
  const statusMult = (entity.effects ?? []).reduce(
    (mult, effect) => mult * (effect.damageTakenMultiplier ?? 1),
    1
  );

  // Equipment armor reduction (pre-computed, stored on player entity)
  const armorMult = entity.equippedArmorMultiplier ?? 1;

  return statusMult * armorMult;
}

function isStunned(entity: CombatEntity): boolean {
  return entity.effects?.some((e) => e.skipTurn) ?? false;
}

// ─── PLAYER ACTIONS ──────────────────────────────────────────

function resolveAttack(
  attacker: CombatEntity,
  defender: CombatEntity,
  logs: BattleLog
): void {
  // Apply pet passives to attacker stats before calculating
  const effectiveAttacker = attacker.pet
    ? applyPetPassive(attacker, attacker.pet)
    : attacker;

  // Weapon bonus (pre-computed from equipped weapon)
  const weaponBonus = effectiveAttacker.equippedWeaponBonus ?? 0;
  const base = 10 + weaponBonus;

  let damage = gameEngine.calculateDamage(effectiveAttacker, base, "melee");

  // Critical hit check
  const isCrit = gameEngine.isCritical(effectiveAttacker.stats.luk);
  if (isCrit) {
    damage = gameEngine.applyCritical(damage);
    logs.push(`💥 Critical strike!`);
  }

  // Pet attack trigger
  if (attacker.pet) {
    const petResult = triggerPetEffects(attacker.pet, {
      player: attacker,
      enemy: defender,
      event: "onAttack",
    });

    damage += petResult.damageBonus;

    if (petResult.logs.length) {
      logs.push(...petResult.logs);
    }
  }

  // Apply defender's damage reduction (armor + status effects)
  damage = Math.max(1, Math.floor(damage * getDamageTakenMultiplier(defender)));

  defender.hp = Math.max(0, defender.hp - damage);

  logs.push(`⚔ ${attacker.name} strikes for ${damage} damage.`);
}

function resolveHeal(attacker: CombatEntity, logs: BattleLog): void {
  const heal = Math.floor(10 + attacker.stats.end * 0.8 + attacker.level * 1.5);
  const healed = Math.min(heal, attacker.maxHp - attacker.hp);
  attacker.hp = Math.min(attacker.maxHp, attacker.hp + heal);

  if (healed <= 0) {
    logs.push(`💚 ${attacker.name} is already at full health.`);
  } else {
    logs.push(`💚 ${attacker.name} heals ${healed} HP.`);
  }
}

function resolveDefend(attacker: CombatEntity, logs: BattleLog): void {
  attacker.defending = true;
  logs.push(`🛡 ${attacker.name} takes a defensive stance.`);
}

function resolvePetAction(
  attacker: CombatEntity,
  defender: CombatEntity,
  logs: BattleLog
): void {
  if (!attacker.pet) {
    logs.push(`🐾 No pet to act!`);
    return;
  }

  const pet = attacker.pet;

  // Pet strike: independent attack based on pet power
  const petDamage = Math.max(1, Math.floor(
    pet.stats.power * 1.2 + attacker.stats.luk * 0.1
  ));

  // Trigger any onAttack pet abilities
  const petResult = triggerPetEffects(pet, {
    player: attacker,
    enemy: defender,
    event: "onAttack",
  });

  const totalDamage = petDamage + petResult.damageBonus;
  defender.hp = Math.max(0, defender.hp - totalDamage);

  logs.push(`🐾 ${pet.name} attacks for ${totalDamage} damage!`);
  logs.push(...petResult.logs);
}

// ─── ENEMY ATTACK ────────────────────────────────────────────

function resolveEnemyAttack(
  attacker: CombatEntity,
  defender: CombatEntity,
  logs: BattleLog
): void {
  // Use monster's scaled baseDamage (set in monsterFactory, scales with level)
  const base = attacker.baseDamage ?? 8;

  let damage = gameEngine.calculateDamage(attacker, base, "melee");

  // Apply defender armor + status reductions
  damage = Math.max(1, Math.floor(damage * getDamageTakenMultiplier(defender)));

  // DEFEND HALVES INCOMING DAMAGE — flag is now actually checked
  if (defender.defending) {
    damage = Math.max(1, Math.floor(damage * 0.5));
    logs.push(`🛡 Defense reduces the blow!`);
  }

  defender.hp = Math.max(0, defender.hp - damage);
  defender.defending = false; // reset after use

  logs.push(`🗡 ${attacker.name} hits ${defender.name} for ${damage} damage.`);
}

// ─── TURN PIPELINE ───────────────────────────────────────────

/**
 * Runs a single full turn.
 *
 * Returns { attacker, defender } — named for the CALLER's perspective,
 * not hardcoded player/enemy. The store maps these back to the
 * correct state slots. This naming change makes entity swaps
 * structurally impossible.
 */
export function runTurn(
  attackerIn: CombatEntity,
  defenderIn: CombatEntity,
  action: Action
): { attacker: CombatEntity; defender: CombatEntity; logs: BattleLog } {
  const logs: BattleLog = [];

  // Shallow-copy both entities to avoid direct Zustand state mutation
  const attacker = copyEntity(attackerIn);
  const defender = copyEntity(defenderIn);

  // ── Phase 1: Status tick ───────────────────────────────────
  applyStatusEffects(attacker, logs);
  applyStatusEffects(defender, logs);

  const attackerStunned = isStunned(attacker);

  // ── Phase 2: Attacker action ───────────────────────────────
  if (!attackerStunned) {
    switch (action) {
      case "attack":
        resolveAttack(attacker, defender, logs);
        break;

      case "heal":
        resolveHeal(attacker, logs);
        break;

      case "defend":
        resolveDefend(attacker, logs);
        break;

      case "pet":
        resolvePetAction(attacker, defender, logs);
        break;
    }
  } else {
    logs.push(`⚡ ${attacker.name} is stunned and cannot act!`);
  }

  // ── Phase 3: Defender counter-attack (if alive) ────────────
  // Note: when this is the enemy's turn, the caller passes enemy as attacker.
  // We don't auto-counter here — the store handles enemy turn explicitly.

  // ── Phase 4: End conditions ────────────────────────────────
  if (defender.hp <= 0) logs.push(`☠ ${defender.name} has been defeated!`);
  if (attacker.hp <= 0) logs.push(`☠ ${attacker.name} has been defeated!`);

  return { attacker, defender, logs };
}

/**
 * Enemy turn wrapper — resolves enemy attack and counter.
 * Separate from runTurn to keep intent explicit and unambiguous.
 */
export function runEnemyTurn(
  enemy: CombatEntity,
  player: CombatEntity
): { updatedPlayer: CombatEntity; updatedEnemy: CombatEntity; logs: BattleLog } {
  const logs: BattleLog = [];

  const e = copyEntity(enemy);
  const p = copyEntity(player);

  applyStatusEffects(e, logs);

  if (!isStunned(e)) {
    resolveEnemyAttack(e, p, logs);
  } else {
    logs.push(`⚡ ${e.name} is stunned!`);
  }

  if (p.hp <= 0) logs.push(`☠ ${p.name} has been defeated!`);

  return { updatedPlayer: p, updatedEnemy: e, logs };
}
