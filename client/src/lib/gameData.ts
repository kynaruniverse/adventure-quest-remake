import { Spell, Weapon, Armor, Monster } from './gameEngine';

export const SPELLS: Record<string, Spell> = {
  'spell-fireball': {
    id: 'spell-fireball',
    name: 'Fireball',
    element: 'fire',
    cost: 15,
    damage: 20,
    accuracy: 85,
    description: 'Hurl a ball of fire at your enemy.',
  },
  'spell-heal': {
    id: 'spell-heal',
    name: 'Heal',
    element: 'light',
    cost: 10,
    damage: 0,
    accuracy: 100,
    description: 'Restore your health.',
  },
  'spell-frostbolt': {
    id: 'spell-frostbolt',
    name: 'Frostbolt',
    element: 'ice',
    cost: 12,
    damage: 18,
    accuracy: 88,
    description: 'Launch a bolt of ice at your enemy.',
  },
  'spell-lightning': {
    id: 'spell-lightning',
    name: 'Lightning',
    element: 'energy',
    cost: 18,
    damage: 25,
    accuracy: 80,
    description: 'Strike with a bolt of lightning.',
  },
  'spell-dark-bolt': {
    id: 'spell-dark-bolt',
    name: 'Dark Bolt',
    element: 'darkness',
    cost: 16,
    damage: 22,
    accuracy: 82,
    description: 'Unleash dark energy.',
  },
};

export const WEAPONS: Record<string, Weapon> = {
  'sword-1': {
    id: 'sword-1',
    name: 'Iron Sword',
    type: 'melee',
    element: 'earth',
    damage: 10,
    accuracy: 85,
    level: 1,
    price: 50,
  },
  'sword-2': {
    id: 'sword-2',
    name: 'Steel Sword',
    type: 'melee',
    element: 'earth',
    damage: 15,
    accuracy: 87,
    level: 5,
    price: 150,
  },
  'bow-1': {
    id: 'bow-1',
    name: 'Wooden Bow',
    type: 'ranged',
    element: 'wind',
    damage: 8,
    accuracy: 80,
    level: 1,
    price: 40,
  },
  'staff-1': {
    id: 'staff-1',
    name: 'Mage Staff',
    type: 'magic',
    element: 'energy',
    damage: 12,
    accuracy: 85,
    level: 1,
    price: 60,
  },
};

export const ARMORS: Record<string, Armor> = {
  'leather-1': {
    id: 'leather-1',
    name: 'Leather Armor',
    defense: 5,
    level: 1,
    price: 30,
  },
  'chain-1': {
    id: 'chain-1',
    name: 'Chain Mail',
    defense: 10,
    level: 5,
    price: 100,
  },
  'plate-1': {
    id: 'plate-1',
    name: 'Plate Armor',
    defense: 15,
    level: 10,
    price: 250,
  },
};

export const MONSTER_TEMPLATES = [
  { name: 'Goblin', element: 'earth' as const, baseDamage: 5, baseHp: 20 },
  { name: 'Skeleton', element: 'darkness' as const, baseDamage: 7, baseHp: 25 },
  { name: 'Fire Elemental', element: 'fire' as const, baseDamage: 10, baseHp: 30 },
  { name: 'Slime', element: 'water' as const, baseDamage: 4, baseHp: 15 },
  { name: 'Orc', element: 'earth' as const, baseDamage: 8, baseHp: 28 },
  { name: 'Ice Wizard', element: 'ice' as const, baseDamage: 9, baseHp: 22 },
  { name: 'Shadow Beast', element: 'darkness' as const, baseDamage: 11, baseHp: 32 },
  { name: 'Wind Sprite', element: 'wind' as const, baseDamage: 6, baseHp: 18 },
  { name: 'Stone Golem', element: 'earth' as const, baseDamage: 12, baseHp: 40 },
  { name: 'Vampire Bat', element: 'darkness' as const, baseDamage: 7, baseHp: 20 },
];

export function getMonsterTemplate(level: number) {
  const template = MONSTER_TEMPLATES[Math.floor(Math.random() * MONSTER_TEMPLATES.length)];
  const scaledHp = template.baseHp + level * 3;
  const scaledDamage = template.baseDamage + level * 0.5;

  return {
    ...template,
    hp: scaledHp,
    damage: scaledDamage,
  };
}
