import { Pet } from "./petTypes";

/**
 * =========================
 * PET PASSIVE APPLICATION
 * =========================
 *
 * Converts pet stats into EFFECT ENGINE modifiers.
 * No direct mutation of character stats long-term.
 */

export function applyPetPassive(player: any, pet?: Pet) {
  if (!pet) return player;

  const strBonus = Math.floor(pet.stats.power / 5);
  const lukBonus = Math.floor(pet.stats.agility / 10);

  return {
    ...player,
    stats: {
      ...player.stats,
      str: player.stats.str + strBonus,
      luk: player.stats.luk + lukBonus,
    },
  };
}

/**
 * =========================
 * PET EFFECT ENGINE
 * =========================
 *
 * Unified trigger system for all pet abilities.
 */

export type PetEvent =
  | "onAttack"
  | "onHit"
  | "onKill"
  | "onTurn";

export type PetContext = {
  player: any;
  enemy: any;
  event: PetEvent;
};

export function triggerPetEffects(
  pet: Pet,
  context: PetContext
): { damageBonus: number; logs: string[] } {
  if (!pet) return { damageBonus: 0, logs: [] };

  const logs: string[] = [];
  let damageBonus = 0;

  /**
   * SINGLE ABILITY MODEL (clean + predictable)
   */
  const ability = pet.ability;

  if (!ability) return { damageBonus: 0, logs };

  if (ability.trigger !== context.event) {
    return { damageBonus: 0, logs };
  }

  switch (ability.effect.type) {
    case "damageBonus":
      damageBonus += ability.effect.value;

      logs.push(
        `${pet.name} triggers ${ability.name} (+${ability.effect.value} dmg)`
      );
      break;

    case "heal":
      logs.push(`${pet.name} triggers ${ability.name} (heal)`);
      break;

    case "statBuff":
      logs.push(`${pet.name} triggers ${ability.name} (buff)`);
      break;

    case "shield":
      logs.push(`${pet.name} triggers ${ability.name} (shield)`);
      break;

    case "statusApply":
      logs.push(`${pet.name} triggers ${ability.name} (status)`);
      break;
  }

  return {
    damageBonus,
    logs,
  };
}