import { gameEngine } from "./gameEngine";
import { triggerPetEffect } from "./petSystem";

/**
 * =========================
 * STATUS EFFECT HELPERS
 * =========================
 */

function applyStatusOnTurn(entity: any, logs: string[]) {
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

function getDamageMultiplier(entity: any): number {
  if (!entity.effects) return 1;

  return entity.effects.reduce((mult: number, effect: any) => {
    return mult * (effect.damageTakenMultiplier ?? 1);
  }, 1);
}

/**
 * =========================
 * INITIATIVE SYSTEM
 * =========================
 */

function buildTurnOrder(player: any, enemy: any) {
  const order = [
    {
      type: "player",
      entity: player,
      speed: player.speed || 10,
    },
    {
      type: "enemy",
      entity: enemy,
      speed: enemy.speed || 8,
    },
  ];

  if (player.pet) {
    order.push({
      type: "pet",
      entity: player.pet,
      speed: player.pet.stats.agility || 5,
    });
  }

  return order.sort((a, b) => b.speed - a.speed);
}

/**
 * =========================
 * PLAYER ACTION
 * =========================
 */

function resolvePlayerAction(player: any, enemy: any, logs: string[]) {
  let damage = gameEngine.calculateDamage(player, 10, "melee");

  // PET TRIGGER
  if (player.pet) {
    const petResult = triggerPetEffect(player.pet, {
      player,
      enemy,
      event: "attack",
    });

    damage += petResult.damageBonus;

    if (petResult.log) logs.push(petResult.log);
  }

  // STATUS MODIFIERS
  damage *= getDamageMultiplier(enemy);

  enemy.hp -= Math.floor(damage);

  logs.push(`Player deals ${Math.floor(damage)} damage`);
}

/**
 * =========================
 * ENEMY ACTION
 * =========================
 */

function resolveEnemyAction(enemy: any, player: any, logs: string[]) {
  let damage = gameEngine.calculateDamage(enemy, 8, "melee");

  damage *= getDamageMultiplier(player);

  player.hp -= Math.floor(damage);

  logs.push(`Enemy deals ${Math.floor(damage)} damage`);
}

/**
 * =========================
 * MAIN TURN SYSTEM
 * =========================
 */

export function executeTurn(player: any, enemy: any, action: string) {
  const logs: string[] = [];

  const turnOrder = buildTurnOrder(player, enemy);

  // =========================
  // APPLY STATUS EFFECTS FIRST
  // =========================
  applyStatusOnTurn(player, logs);
  applyStatusOnTurn(enemy, logs);

  // =========================
  // CHECK IF PLAYER SKIPS TURN
  // =========================
  const playerStunned = player.effects?.some((e: any) => e.skipTurn);

  // =========================
  // RESOLVE ACTIONS IN ORDER
  // =========================
  for (const turn of turnOrder) {
    if (turn.type === "player") {
      if (playerStunned) {
        logs.push("Player is unable to act!");
        continue;
      }

      if (action === "attack") {
        resolvePlayerAction(player, enemy, logs);
      }

      if (action === "heal") {
        const heal = 10 + player.stats.end;
        player.hp = Math.min(player.maxHp, player.hp + heal);
        logs.push(`Player heals ${heal}`);
      }

      if (action === "defend") {
        player.defending = true;
        logs.push("Player defends");
      }
    }

    if (turn.type === "enemy") {
      resolveEnemyAction(enemy, player, logs);
    }

    if (turn.type === "pet") {
      // optional future pet independent turn
    }

    // early exit if fight ends
    if (enemy.hp <= 0) {
      logs.push("Enemy defeated!");
      break;
    }

    if (player.hp <= 0) {
      logs.push("Player defeated!");
      break;
    }
  }

  return {
    player,
    enemy,
    logs,
  };
}