import { CharacterStats } from "./combatTypes";

/**
 * =========================
 * CHARACTER CLASSES
 * =========================
 *
 * CharacterStats imported from combatTypes — single source of truth.
 * Each class defines:
 *   - baseStats        used by characterFactory.ts to build the player
 *   - description      shown in CharacterCreation class card
 *   - startingSpell    shown as a bonus hint on the stat preview
 */

export type CharacterClass =
  | "Warrior"
  | "Mage"
  | "Ranger"
  | "Rogue"
  | "Paladin"
  | "Shaman";

export type ClassDefinition = {
  baseStats: CharacterStats;
  description: string;
  startingSpell?: string;
};

export const CHARACTER_CLASSES: Record<CharacterClass, ClassDefinition> = {
  Warrior: {
    baseStats: { str: 16, dex: 10, int: 6,  end: 14, cha: 8,  luk: 6  },
    description: "Mighty melee fighter with high endurance.",
    startingSpell: "Shield Bash",
  },

  Mage: {
    baseStats: { str: 6,  dex: 8,  int: 18, end: 8,  cha: 10, luk: 10 },
    description: "Master of elemental magic and arcane power.",
    startingSpell: "Fireball",
  },

  Ranger: {
    baseStats: { str: 10, dex: 16, int: 10, end: 10, cha: 8,  luk: 8  },
    description: "Precise ranged attacker with high dexterity.",
    startingSpell: "Multi Shot",
  },

  Rogue: {
    baseStats: { str: 10, dex: 18, int: 8,  end: 8,  cha: 10, luk: 12 },
    description: "Cunning and fast. Strikes from the shadows.",
    startingSpell: "Piercing Shot",
  },

  Paladin: {
    baseStats: { str: 14, dex: 8,  int: 10, end: 16, cha: 12, luk: 6  },
    description: "Holy warrior who heals allies and smites foes.",
    startingSpell: "Heal",
  },

  Shaman: {
    baseStats: { str: 10, dex: 10, int: 14, end: 10, cha: 10, luk: 10 },
    description: "Nature mage with balanced magic and resilience.",
    startingSpell: "Frostbolt",
  },
};
