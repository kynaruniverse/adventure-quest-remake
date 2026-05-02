import { CharacterStats, Spell } from './gameEngine';

export type CharacterClass = 'warrior' | 'mage' | 'ranger';

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

export const CHARACTER_CLASSES: Record<CharacterClass, ClassDefinition> = {
  warrior: {
    name: 'Warrior',
    description: 'Strong melee fighter with high HP and defense.',
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
        id: 'spell-slash',
        name: 'Power Slash',
        element: 'earth',
        cost: 5,
        damage: 25,
        accuracy: 90,
        description: 'A powerful melee attack.',
      },
      {
        id: 'spell-shield-bash',
        name: 'Shield Bash',
        element: 'earth',
        cost: 8,
        damage: 15,
        accuracy: 95,
        description: 'Bash with your shield.',
      },
    ],
    classAbility: {
      name: 'Berserker Rage',
      description: 'Temporarily increase damage output',
      effect: '+50% damage for 3 turns',
    },
  },
  mage: {
    name: 'Mage',
    description: 'Master of magic with high MP and spell power.',
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
        id: 'spell-fireball',
        name: 'Fireball',
        element: 'fire',
        cost: 15,
        damage: 20,
        accuracy: 85,
        description: 'Hurl a ball of fire.',
      },
      {
        id: 'spell-mana-shield',
        name: 'Mana Shield',
        element: 'energy',
        cost: 12,
        damage: 0,
        accuracy: 100,
        description: 'Protect yourself with magical energy.',
      },
      {
        id: 'spell-heal',
        name: 'Heal',
        element: 'light',
        cost: 10,
        damage: 0,
        accuracy: 100,
        description: 'Restore your health.',
      },
    ],
    classAbility: {
      name: 'Spell Amplify',
      description: 'Increase spell damage and reduce MP cost',
      effect: '+30% spell damage, -20% MP cost for 3 turns',
    },
  },
  ranger: {
    name: 'Ranger',
    description: 'Agile fighter with high accuracy and critical chance.',
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
        id: 'spell-piercing-shot',
        name: 'Piercing Shot',
        element: 'wind',
        cost: 8,
        damage: 18,
        accuracy: 92,
        description: 'A precise ranged attack.',
      },
      {
        id: 'spell-multi-shot',
        name: 'Multi-Shot',
        element: 'wind',
        cost: 12,
        damage: 15,
        accuracy: 85,
        description: 'Fire multiple arrows.',
      },
      {
        id: 'spell-evasion',
        name: 'Evasion',
        element: 'wind',
        cost: 10,
        damage: 0,
        accuracy: 100,
        description: 'Dodge incoming attacks.',
      },
    ],
    classAbility: {
      name: 'Rapid Fire',
      description: 'Attack multiple times in one turn',
      effect: 'Attack 2 additional times with reduced damage',
    },
  },
};

export function getClassDefinition(classType: CharacterClass): ClassDefinition {
  return CHARACTER_CLASSES[classType];
}
