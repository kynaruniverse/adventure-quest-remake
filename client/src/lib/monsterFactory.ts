import { CombatEntity } from "./combatTypes";

/**
 * =========================
 * MONSTER FACTORY
 * =========================
 *
 * Returns CombatEntity (not `any`).
 *
 * FIX: baseDamage is set and USED by effectEngine (was ignored before).
 * FIX: All monsters now typed as CombatEntity.
 *
 * difficulty parameter allows node-based scaling from the world map.
 */

type MonsterTemplate = {
  name: string;
  baseHp: number;
  baseDamage: number;
  element: CombatEntity["element"];
  statBias: {
    str: number;
    dex: number;
    int: number;
  };
};

const TEMPLATES: MonsterTemplate[] = [
  {
    name: "Goblin",
    baseHp: 20,
    baseDamage: 5,
    element: "earth",
    statBias: { str: 1, dex: 2, int: 0 },
  },
  {
    name: "Skeleton",
    baseHp: 25,
    baseDamage: 7,
    element: "darkness",
    statBias: { str: 2, dex: 0, int: 1 },
  },
  {
    name: "Fire Elemental",
    baseHp: 22,
    baseDamage: 10,
    element: "fire",
    statBias: { str: 0, dex: 1, int: 3 },
  },
  {
    name: "Slime",
    baseHp: 30,
    baseDamage: 4,
    element: "water",
    statBias: { str: 0, dex: 0, int: 0 },
  },
  {
    name: "Orc",
    baseHp: 32,
    baseDamage: 9,
    element: "earth",
    statBias: { str: 3, dex: 0, int: 0 },
  },
  {
    name: "Frost Wraith",
    baseHp: 20,
    baseDamage: 8,
    element: "ice",
    statBias: { str: 0, dex: 2, int: 2 },
  },
];

export function createMonster(level: number, difficulty = 1): CombatEntity {
  const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];

  const scaledHp       = template.baseHp + level * 5 + difficulty * 3;
  const scaledDamage   = template.baseDamage + level * 0.8 + difficulty * 0.5;

  return {
    id: `monster-${Date.now()}`,
    name: template.name,
    level,
    element: template.element,

    stats: {
      str: 8 + level + template.statBias.str,
      dex: 8 + level + template.statBias.dex,
      int: 6 + level + template.statBias.int,
      end: 8 + level,
      cha: 5,
      luk: 5 + Math.floor(level / 2),
    },

    hp: scaledHp,
    maxHp: scaledHp,

    // Used by resolveEnemyAttack in effectEngine (was hardcoded 8 before — fixed)
    baseDamage: Math.floor(scaledDamage),

    effects: [],

    // Monsters don't have equipment bonuses
    equippedWeaponBonus: 0,
    equippedArmorMultiplier: 1,
  };
}
