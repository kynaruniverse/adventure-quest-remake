import { CharacterStats, Spell } from "./combatTypes";

export type CharacterClass = "warrior" | "mage" | "ranger";

export interface ClassDefinition {
  name: string;
  description: string;

  baseStats: CharacterStats;
  startingSpells: Spell[];

  classAbility: {
    name: string;
    description: string;
    effect: string;
  };
}

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

    startingSpells: [
      {
        id: "slash",
        name: "Power Slash",
        element: "earth",
        cost: 5,
        damage: 25,
        accuracy: 90,
        description: "A powerful melee attack.",
      },
      {
        id: "shield_bash",
        name: "Shield Bash",
        element: "earth",
        cost: 8,
        damage: 15,
        accuracy: 95,
        description: "Bash with your shield.",
      },
    ],

    classAbility: {
      name: "Berserker Rage",
      description: "Temporarily increase damage output",
      effect: "+50% damage for 3 turns",
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

    startingSpells: [
      {
        id: "fireball",
        name: "Fireball",
        element: "fire",
        cost: 15,
        damage: 20,
        accuracy: 85,
        description: "Hurl a ball of fire.",
      },
      {
        id: "mana_shield",
        name: "Mana Shield",
        element: "energy",
        cost: 12,
        damage: 0,
        accuracy: 100,
        description: "Protect yourself with magic.",
      },
      {
        id: "heal",
        name: "Heal",
        element: "light",
        cost: 10,
        damage: 0,
        accuracy: 100,
        description: "Restore your health.",
      },
    ],

    classAbility: {
      name: "Spell Amplify",
      description: "Increase spell power",
      effect: "+30% spell damage for 3 turns",
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

    startingSpells: [
      {
        id: "piercing_shot",
        name: "Piercing Shot",
        element: "wind",
        cost: 8,
        damage: 18,
        accuracy: 92,
        description: "A precise ranged attack.",
      },
      {
        id: "multi_shot",
        name: "Multi-Shot",
        element: "wind",
        cost: 12,
        damage: 15,
        accuracy: 85,
        description: "Fire multiple arrows.",
      },
    ],

    classAbility: {
      name: "Rapid Fire",
      description: "Attack multiple times",
      effect: "2 extra attacks at reduced damage",
    },
  },
};

export function getClassDefinition(type: CharacterClass) {
  return CHARACTER_CLASSES[type];
}