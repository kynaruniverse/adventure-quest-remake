import { CharacterStats, Spell, Element } from "./combatTypes";

/**
 * =========================
 * CORE TYPES
 * =========================
 */

export type CharacterClass = "warrior" | "mage" | "ranger";

/**
 * Structured effect system (ENGINE READY)
 */
export type EffectDefinition =
  | {
      type: "statModifier";
      target: keyof CharacterStats;
      multiplier?: number;
      flatBonus?: number;
      duration: number;
      trigger: "onAttack" | "onTurn" | "passive";
    }
  | {
      type: "extraAttacks";
      count: number;
      damageMultiplier: number;
      duration: number;
      trigger: "onAttack";
    }
  | {
      type: "critBoost";
      chanceBonus: number;
      duration: number;
      trigger: "onAttack";
    };

/**
 * =========================
 * CLASS DEFINITION
 * =========================
 */

export interface ClassDefinition {
  name: string;
  description: string;

  baseStats: CharacterStats;

  startingSpells: string[]; // references to SPELLS registry

  classAbility: {
    name: string;
    description: string;
    effect: EffectDefinition;
  };
}

/**
 * =========================
 * CLASSES
 * =========================
 */

export const CHARACTER_CLASSES: Record<
  CharacterClass,
  ClassDefinition
> = {
  warrior: {
    name: "Warrior",
    description: "Strong melee fighter with high HP and defense.",

    baseStats: {
      str: 15,
      dex: 10,
      int: 8,
      end: 14,
      cha: 10,
      luk: 8,
    },

    startingSpells: ["slash", "shield_bash"],

    classAbility: {
      name: "Berserker Rage",
      description: "Temporarily increase damage output",
      effect: {
        type: "statModifier",
        target: "str",
        multiplier: 1.5,
        duration: 3,
        trigger: "onAttack",
      },
    },
  },

  mage: {
    name: "Mage",
    description: "Master of magic with high MP and spell power.",

    baseStats: {
      str: 8,
      dex: 10,
      int: 16,
      end: 10,
      cha: 12,
      luk: 10,
    },

    startingSpells: ["fireball", "mana_shield", "heal"],

    classAbility: {
      name: "Spell Amplify",
      description: "Increase spell power",

      effect: {
        type: "statModifier",
        target: "int",
        multiplier: 1.3,
        duration: 3,
        trigger: "onAttack",
      },
    },
  },

  ranger: {
    name: "Ranger",
    description: "Agile fighter with high accuracy and crit chance.",

    baseStats: {
      str: 11,
      dex: 16,
      int: 10,
      end: 11,
      cha: 10,
      luk: 14,
    },

    startingSpells: ["piercing_shot", "multi_shot"],

    classAbility: {
      name: "Rapid Fire",
      description: "Attack multiple times",

      effect: {
        type: "extraAttacks",
        count: 2,
        damageMultiplier: 0.6,
        duration: 1,
        trigger: "onAttack",
      },
    },
  },
};

/**
 * =========================
 * HELPERS
 * =========================
 */

export function getClassDefinition(type: CharacterClass) {
  return CHARACTER_CLASSES[type];
}