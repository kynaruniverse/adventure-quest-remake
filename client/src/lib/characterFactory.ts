import { CHARACTER_CLASSES, CharacterClass } from "./characterClasses";

/**
 * =========================
 * CORE PLAYER TYPE
 * =========================
 */

export type Player = {
  id: string;
  name: string;

  level: number;
  exp: number;

  stats: {
    str: number;
    dex: number;
    int: number;
    end: number;
    cha: number;
    luk: number;
  };

  hp: number;
  maxHp: number;

  mp: number;
  maxMp: number;

  gold: number;

  // 🧠 runtime systems (Effect Engine ready)
  effects?: any[];
  defending?: boolean;
  speed?: number;

  pet?: any;
};

/**
 * =========================
 * BASE STAT HELPERS
 * =========================
 */

function buildBaseStats() {
  return {
    str: 10,
    dex: 10,
    int: 10,
    end: 10,
    cha: 10,
    luk: 10,
  };
}

function buildResources(stats: Player["stats"]) {
  const hp = 50 + stats.end * 2;
  const mp = 30 + stats.int * 2;

  return { hp, mp };
}

/**
 * =========================
 * DEFAULT PLAYER
 * =========================
 */

export function createDefaultPlayer(): Player {
  const stats = buildBaseStats();
  const { hp, mp } = buildResources(stats);

  return {
    id: "player-1",
    name: "Adventurer",

    level: 1,
    exp: 0,

    stats,

    hp,
    maxHp: hp,

    mp,
    maxMp: mp,

    gold: 100,

    // 🧠 engine defaults
    effects: [],
    defending: false,
    speed: 10,
  };
}

/**
 * =========================
 * CLASS-BASED CREATION
 * =========================
 */

export function createPlayerFromClass(
  name: string,
  selectedClass: CharacterClass
): Player {
  const classDef = CHARACTER_CLASSES[selectedClass];

  const stats = { ...classDef.baseStats };
  const { hp, mp } = buildResources(stats);

  return {
    id: "player-1",
    name: name || "Adventurer",

    level: 1,
    exp: 0,

    stats,

    hp,
    maxHp: hp,

    mp,
    maxMp: mp,

    gold: 100,

    // 🧠 engine defaults
    effects: [],
    defending: false,
    speed: 10,
  };
}