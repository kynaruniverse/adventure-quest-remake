import { Pet } from "./petTypes";
import { Character, Monster } from "./gameEngine";

export function applyPetPassive(player: Character, pet?: Pet): Character {
  if (!pet) return player;

  // NOTE: still simple scaling, but isolated cleanly
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

export function triggerPetEffect(
  pet: Pet,
  context: {
    player: Character;
    enemy: Monster;
    event: "attack" | "hitTaken" | "kill";
  }
): { damageBonus: number; log?: string } {
  const ability = pet.ability;

  if (!ability) return { damageBonus: 0 };

  switch (context.event) {
    case "attack":
      if (ability.trigger === "onAttack") {
        return {
          damageBonus: pet.stats.power,
          log: `${pet.name} triggers ${ability.name}!`,
        };
      }
      break;

    case "hitTaken":
      if (ability.trigger === "onHit") {
        return {
          damageBonus: 0,
          log: `${pet.name} reacts: ${ability.name}!`,
        };
      }
      break;

    case "kill":
      if (ability.trigger === "onKill") {
        return {
          damageBonus: 0,
          log: `${pet.name} celebrates: ${ability.name}!`,
        };
      }
      break;
  }

  return { damageBonus: 0 };
}