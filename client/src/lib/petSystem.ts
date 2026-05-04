import { Pet } from "./petTypes";
import { CombatEntity } from "./combatTypes";

/**
 * =========================
 * PET PASSIVE APPLICATION
 * =========================
 *
 * Converts pet stats into flat bonuses applied to the
 * attacker entity before damage calculation.
 * Called in effectEngine before resolveAttack.
 */
export function applyPetPassive(player: CombatEntity, pet?: Pet): CombatEntity {
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
 * PET EVENT TYPES
 * =========================
 */
export type PetEvent = "onAttack" | "onHit" | "onKill" | "onTurn";

export type PetContext = {
  player: CombatEntity;
  enemy: CombatEntity;
  event: PetEvent;
};

/**
 * =========================
 * PET TRIGGER SYSTEM
 * =========================
 *
 * FIX: Was reading pet.ability (undefined, singular).
 * Now correctly iterates pet.abilities (array).
 *
 * Also handles cooldowns — ability won't fire if on cooldown.
 * Cooldown is decremented each time the pet's trigger event fires,
 * whether or not the ability was usable.
 */
export function triggerPetEffects(
  pet: Pet,
  context: PetContext
): { damageBonus: number; logs: string[] } {
  if (!pet?.abilities?.length) {
    return { damageBonus: 0, logs: [] };
  }

  const logs: string[] = [];
  let damageBonus = 0;

  for (const ability of pet.abilities) {
    // Only trigger on matching event
    if (ability.trigger !== context.event) continue;

    // Check cooldown
    const currentCooldown = pet.cooldowns[ability.id] ?? 0;
    if (currentCooldown > 0) {
      pet.cooldowns[ability.id] = currentCooldown - 1;
      continue;
    }

    // Set cooldown after use (if defined)
    if (ability.cooldown && ability.cooldown > 0) {
      pet.cooldowns[ability.id] = ability.cooldown;
    }

    // Resolve effect
    switch (ability.effect.type) {
      case "damageBonus":
        damageBonus += ability.effect.value;
        logs.push(
          `🐾 ${pet.name}: ${ability.name} (+${ability.effect.value} dmg)`
        );
        break;

      case "heal":
        // Heal applied to player — return in future via healBonus field
        logs.push(
          `🐾 ${pet.name}: ${ability.name} (${ability.effect.value} HP restored)`
        );
        break;

      case "statBuff":
        logs.push(
          `🐾 ${pet.name}: ${ability.name} (stat buff active)`
        );
        break;

      case "shield":
        logs.push(
          `🐾 ${pet.name}: ${ability.name} (shield raised)`
        );
        break;

      case "statusApply":
        logs.push(
          `🐾 ${pet.name}: ${ability.name} (status applied)`
        );
        break;
    }
  }

  return { damageBonus, logs };
}
