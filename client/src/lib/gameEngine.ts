import { CharacterStats } from "./combatTypes";

export type AttackType = "melee" | "ranged" | "magic";

export const gameEngine = {
  calculateDamage: (
    attacker: { stats: CharacterStats },
    base: number,
    type: AttackType
  ) => {
    let stat = 0;

    if (type === "melee") stat = attacker.stats.str;
    if (type === "ranged") stat = attacker.stats.dex;
    if (type === "magic") stat = attacker.stats.int;

    const variance = Math.random() * 0.2 - 0.1;

    return Math.max(
      1,
      Math.floor((base + stat / 8) * (1 + variance))
    );
  },

  calculateAccuracy: (
    attacker: { stats: CharacterStats },
    base: number,
    type: AttackType
  ) => {
    let stat = 0;

    if (type === "melee") stat = attacker.stats.str;
    if (type === "ranged") stat = attacker.stats.dex;
    if (type === "magic") stat = attacker.stats.int;

    return Math.min(100, base + stat * 0.2);
  },

  isHit: (accuracy: number) => {
    return Math.random() * 100 < accuracy;
  },

  isCritical: (luk: number) => {
    const chance = Math.min(25, luk / 10);
    return Math.random() * 100 < chance;
  },

  applyCritical: (damage: number) => {
    return Math.floor(damage * 1.5);
  },
};