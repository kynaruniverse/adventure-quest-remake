// AdventureQuest Remake - Game Engine
// Classic turn-based RPG combat system

export interface CharacterStats {
  str: number; // Strength - melee damage
  dex: number; // Dexterity - ranged damage
  int: number; // Intellect - magic damage
  end: number; // Endurance - max HP
  cha: number; // Charisma - pet/guest damage
  luk: number; // Luck - critical chance
}

export interface Character {
  id: string;
  name: string;
  level: number;
  exp: number;
  stats: CharacterStats;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  sp: number;
  maxSp: number;
  equipment: {
    weapon: string;
    armor: string;
    shield: string;
  };
  spells: Spell[];
  items: InventoryItem[];
  gold: number;
}

export interface Monster {
  id: string;
  name: string;
  level: number;
  stats: CharacterStats;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  element: Element;
  drops: {
    gold: number;
    exp: number;
    items: string[];
  };
}

export interface Spell {
  id: string;
  name: string;
  element: Element;
  cost: number; // MP cost
  damage: number;
  accuracy: number;
  description: string;
}

export interface Weapon {
  id: string;
  name: string;
  type: 'melee' | 'ranged' | 'magic';
  element: Element;
  damage: number;
  accuracy: number;
  level: number;
  price: number;
}

export interface Armor {
  id: string;
  name: string;
  defense: number;
  level: number;
  price: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  type: 'potion' | 'elixir' | 'scroll' | 'misc';
  effect: string;
  quantity: number;
}

export type Element = 'fire' | 'water' | 'wind' | 'ice' | 'earth' | 'energy' | 'light' | 'darkness';

export interface BattleState {
  playerTurn: boolean;
  playerHp: number;
  monsterHp: number;
  battleLog: string[];
  round: number;
}

export interface BattleAction {
  type: 'attack' | 'spell' | 'item' | 'defend' | 'run';
  target: 'player' | 'monster';
  value?: string; // spell id or item id
}

// Damage calculation
export function calculateDamage(
  attacker: Character | Monster,
  defender: Character | Monster,
  attackType: 'melee' | 'ranged' | 'magic',
  baseDamage: number
): number {
  let statBonus = 0;

  if (attackType === 'melee') {
    statBonus = attacker.stats.str / 8;
  } else if (attackType === 'ranged') {
    statBonus = attacker.stats.dex / 8;
  } else if (attackType === 'magic') {
    statBonus = attacker.stats.int / 8;
  }

  const variance = Math.random() * 0.2 - 0.1; // ±10% variance
  const totalDamage = Math.max(1, Math.floor((baseDamage + statBonus) * (1 + variance)));

  return totalDamage;
}

// Accuracy calculation
export function calculateAccuracy(
  attacker: Character | Monster,
  defender: Character | Monster,
  baseAccuracy: number,
  attackType: 'melee' | 'ranged' | 'magic'
): number {
  let statBonus = 0;

  if (attackType === 'melee') {
    statBonus = attacker.stats.str * 4 / 25;
  } else if (attackType === 'ranged') {
    statBonus = attacker.stats.dex * 4 / 25;
  } else if (attackType === 'magic') {
    statBonus = attacker.stats.int * 4 / 25;
  }

  return Math.min(100, baseAccuracy + statBonus);
}

// Check if attack hits
export function isHit(accuracy: number): boolean {
  return Math.random() * 100 < accuracy;
}

// Check for critical hit
export function isCritical(luck: number): boolean {
  const critChance = Math.min(25, luck / 10);
  return Math.random() * 100 < critChance;
}

// Process player action
export function processPlayerAction(
  player: Character,
  monster: Monster,
  action: BattleAction
): { damage: number; log: string; hit: boolean; critical: boolean } {
  let damage = 0;
  let log = '';
  let hit = false;
  let critical = false;

  if (action.type === 'attack') {
    const accuracy = calculateAccuracy(player, monster, 85, 'melee');
    hit = isHit(accuracy);

    if (hit) {
      critical = isCritical(player.stats.luk);
      damage = calculateDamage(player, monster, 'melee', 10);
      if (critical) {
        damage = Math.floor(damage * 1.5);
        log = `${player.name} lands a CRITICAL HIT for ${damage} damage!`;
      } else {
        log = `${player.name} attacks for ${damage} damage!`;
      }
    } else {
      log = `${player.name}'s attack misses!`;
    }
  } else if (action.type === 'spell' && action.value) {
    const spell = player.spells.find(s => s.id === action.value);
    if (spell && player.mp >= spell.cost) {
      player.mp -= spell.cost;
      const accuracy = calculateAccuracy(player, monster, spell.accuracy, 'magic');
      hit = isHit(accuracy);

      if (hit) {
        critical = isCritical(player.stats.luk);
        damage = calculateDamage(player, monster, 'magic', spell.damage);
        if (critical) {
          damage = Math.floor(damage * 1.5);
          log = `${player.name} casts ${spell.name} for CRITICAL ${damage} damage!`;
        } else {
          log = `${player.name} casts ${spell.name} for ${damage} damage!`;
        }
      } else {
        log = `${spell.name} misses!`;
      }
    } else {
      log = `Not enough MP to cast ${spell?.name || 'spell'}!`;
    }
  } else if (action.type === 'defend') {
    log = `${player.name} takes a defensive stance!`;
  }

  return { damage, log, hit, critical };
}

// Process monster action
export function processMonsterAction(
  monster: Monster,
  player: Character
): { damage: number; log: string; hit: boolean } {
  const actionType = Math.random() > 0.7 ? 'spell' : 'attack';
  let damage = 0;
  let log = '';
  let hit = false;

  if (actionType === 'attack') {
    const accuracy = calculateAccuracy(monster, player, 80, 'melee');
    hit = isHit(accuracy);

    if (hit) {
      damage = calculateDamage(monster, player, 'melee', 8);
      log = `${monster.name} attacks for ${damage} damage!`;
    } else {
      log = `${monster.name}'s attack misses!`;
    }
  } else {
    const accuracy = calculateAccuracy(monster, player, 75, 'magic');
    hit = isHit(accuracy);

    if (hit) {
      damage = calculateDamage(monster, player, 'magic', 12);
      log = `${monster.name} casts a spell for ${damage} damage!`;
    } else {
      log = `${monster.name}'s spell misses!`;
    }
  }

  return { damage, log, hit };
}

// Create default player character
export function createDefaultPlayer(): Character {
  return {
    id: 'player-1',
    name: 'Adventurer',
    level: 1,
    exp: 0,
    stats: {
      str: 10,
      dex: 10,
      int: 10,
      end: 10,
      cha: 10,
      luk: 10,
    },
    hp: 50,
    maxHp: 50,
    mp: 30,
    maxMp: 30,
    sp: 20,
    maxSp: 20,
    equipment: {
      weapon: 'sword-1',
      armor: 'leather-1',
      shield: 'shield-1',
    },
    spells: [
      {
        id: 'spell-fireball',
        name: 'Fireball',
        element: 'fire',
        cost: 15,
        damage: 20,
        accuracy: 85,
        description: 'Hurl a ball of fire at your enemy.',
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
    items: [
      {
        id: 'potion-health',
        name: 'Health Potion',
        type: 'potion',
        effect: 'Restore 25 HP',
        quantity: 3,
      },
    ],
    gold: 100,
  };
}

// Create a random monster
export function createRandomMonster(level: number): Monster {
  const monsters = [
    { name: 'Goblin', element: 'earth' as Element, baseDamage: 5 },
    { name: 'Skeleton', element: 'darkness' as Element, baseDamage: 7 },
    { name: 'Fire Elemental', element: 'fire' as Element, baseDamage: 10 },
    { name: 'Slime', element: 'water' as Element, baseDamage: 4 },
    { name: 'Orc', element: 'earth' as Element, baseDamage: 8 },
  ];

  const template = monsters[Math.floor(Math.random() * monsters.length)];
  const hp = 20 + level * 5;

  return {
    id: `monster-${Date.now()}`,
    name: template.name,
    level,
    stats: {
      str: 8 + level,
      dex: 8 + level,
      int: 6 + level,
      end: 8 + level,
      cha: 5,
      luk: 5,
    },
    hp,
    maxHp: hp,
    mp: 10 + level * 2,
    maxMp: 10 + level * 2,
    element: template.element,
    drops: {
      gold: 20 + level * 5,
      exp: 50 + level * 10,
      items: [],
    },
  };
}
