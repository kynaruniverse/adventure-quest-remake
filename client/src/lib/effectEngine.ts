import { gameEngine } from "./gameEngine";
import { triggerPetEffects } from "./petSystem";

/**
 * =====================================================
 * CORE TYPES
 * =====================================================
 */

export type Entity = any;
export type BattleLog = string[];
export type Action = "attack" | "heal" | "defend" | "pet";

/**
 * =====================================================
 * STATUS PIPELINE
 * =====================================================
 */

function applyStatusEffects(entity: Entity, logs: BattleLog) {
  if (!entity.effects) return;

  entity.effects = entity.effects.filter((effect: any) => {
    if (effect.onTurn) {
      effect.onTurn(entity);
    }

    effect.duration -= 1;

    if (effect.duration <= 0) {
      logs.push(`${effect.name} ends`);
      return false;
    }

    return true;
  });
}

function getDamageTakenMultiplier(entity: Entity): number {
  if (!entity.effects) return 1;

  return entity.effects.reduce((mult: number, effect: any) => {
    return mult * (effect.damageTakenMultiplier ?? 1);
  }, 1);
}

function isStunned(entity: Entity): boolean {
  return entity.effects?.some((e: any) => e.skipTurn) ?? false;
}

/**
 * =====================================================
 * CORE ACTION PIPELINE (NOW EFFECT-DRIVEN)
 * =====================================================
 */

function resolveAttack(player: Entity, enemy: Entity, logs: BattleLog) {
  let damage = gameEngine.calculateDamage(player, 10, "melee");

  // 🐾 PET SYSTEM (now unified via effect engine)
  if (player.pet) {
    const petResult = triggerPetEffects(player.pet, {
      player,
      enemy,
      event: "onAttack",
    });

    damage += petResult.damageBonus;
    logs.push(...petResult.logs);
  }

  // 🧠 STATUS / BUFFS / DEBUFFS
  damage *= getDamageTakenMultiplier(enemy);

  enemy.hp -= Math.floor(damage);

  logs.push(`Player deals ${Math.floor(damage)} damage`);
}

function resolveHeal(player: Entity, logs: BattleLog) {
  const heal = 10 + player.stats.end;
  player.hp = Math.min(player.maxHp, player.hp + heal);
  logs.push(`Player heals ${heal}`);
}

function resolveDefend(player: Entity, logs: BattleLog) {
  player.defending = true;
  logs.push("Player defends");
}

function resolveEnemyAttack(enemy: Entity, player: Entity, logs: BattleLog) {
  let damage = gameEngine.calculateDamage(enemy, 8, "melee");

  damage *= getDamageTakenMultiplier(player);

  player.hp -= Math.floor(damage);

  logs.push(`Enemy deals ${Math.floor(damage)} damage`);
}

/**
 * =====================================================
 * TURN PIPELINE (UNIFIED SYSTEM)
 * =====================================================
 */

export function runTurn(
  player: Entity,
  enemy: Entity,
  action: Action
) {
  const logs: BattleLog = [];

  /**
   * PHASE 1: STATUS EFFECTS (GLOBAL TICK)
   */
  applyStatusEffects(player, logs);
  applyStatusEffects(enemy, logs);

  const playerStunned = isStunned(player);

  /**
   * PHASE 2: PLAYER ACTION
   */
  if (!playerStunned) {
    switch (action) {
      case "attack":
        resolveAttack(player, enemy, logs);
        break;

      case "heal":
        resolveHeal(player, logs);
        break;

      case "defend":
        resolveDefend(player, logs);
        break;
    }
  } else {
    logs.push("Player is stunned and cannot act!");
  }

  /**
   * PHASE 3: ENEMY RESPONSE
   */
  if (enemy.hp > 0) {
    resolveEnemyAttack(enemy, player, logs);
  }

  /**
   * PHASE 4: END CONDITIONS
   */
  if (enemy.hp <= 0) logs.push("Enemy defeated!");
  if (player.hp <= 0) logs.push("Player defeated!");

  return {
    player,
    enemy,
    logs,
  };
}