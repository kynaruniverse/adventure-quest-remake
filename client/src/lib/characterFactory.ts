import { CharacterStats } from "./combatTypes";
import { CHARACTER_CLASSES, CharacterClass } from "./characterClasses";

/**
 * =========================
 * PLAYER TYPE
 * =========================
 *
 * CharacterStats imported from combatTypes — no re-declaration.
 * Equipment bonus fields are pre-computed and stored on the player
 * so the effectEngine never needs to look up shop data mid-combat.
 */

export type Player = {
  id: string;
  name: string;
  class?: CharacterClass;

  level: number;
  exp: number;
  expToNextLevel: number;

  stats: CharacterStats;

  hp: number;
  maxHp: number;

  mp: number;
  maxMp: number;

  gold: number;

  // ─── Engine flags ───────────────────────────────────────
  effects?: import("./combatTypes").StatusEffect[];
  defending?: boolean;
  speed?: number;

  // ─── Pet slot ───────────────────────────────────────────
  pet?: import("./petTypes").Pet;

  // ─── Pre-computed equipment combat bonuses ───────────────
  // Set by useGameStore.equipWeapon / equipArmor.
  // Read directly by effectEngine — no shop lookup mid-combat.
  equippedWeaponBonus: number;
  equippedArmorMultiplier: number;
};

// ─── HELPERS ─────────────────────────────────────────────────

function buildResources(stats: CharacterStats) {
  return {
    hp: 50 + stats.end * 2,
    mp: 30 + stats.int * 2,
  };
}

export function expToNextLevel(level: number): number {
  return level * 100;
}

// ─── DEFAULT PLAYER ──────────────────────────────────────────

export function createDefaultPlayer(): Player {
  const stats: CharacterStats = {
    str: 10,
    dex: 10,
    int: 10,
    end: 10,
    cha: 10,
    luk: 10,
  };

  const { hp, mp } = buildResources(stats);

  return {
    id: "player-1",
    name: "Adventurer",

    level: 1,
    exp: 0,
    expToNextLevel: expToNextLevel(1),

    stats,

    hp,
    maxHp: hp,
    mp,
    maxMp: mp,

    gold: 100,

    effects: [],
    defending: false,
    speed: 10,

    equippedWeaponBonus: 0,
    equippedArmorMultiplier: 1,
  };
}

// ─── CLASS-BASED CREATION ────────────────────────────────────

export function createPlayerFromClass(
  name: string,
  selectedClass: CharacterClass
): Player {
  const classDef = CHARACTER_CLASSES[selectedClass];
  const stats = { ...classDef.baseStats };
  const { hp, mp } = buildResources(stats);

  return {
    id: "player-1",
    name: name.trim() || "Adventurer",
    class: selectedClass,

    level: 1,
    exp: 0,
    expToNextLevel: expToNextLevel(1),

    stats,

    hp,
    maxHp: hp,
    mp,
    maxMp: mp,

    gold: 100,

    effects: [],
    defending: false,
    speed: 10,

    equippedWeaponBonus: 0,
    equippedArmorMultiplier: 1,
  };
}

// ─── LEVEL UP ────────────────────────────────────────────────

/**
 * Apply a level-up to a player.
 * Returns a new Player with increased stats, HP, and MP.
 * HP and MP are fully restored on level up.
 */
export function applyLevelUp(player: Player): Player {
  const newLevel = player.level + 1;

  const newStats: CharacterStats = {
    str: player.stats.str + 2,
    dex: player.stats.dex + 2,
    int: player.stats.int + 2,
    end: player.stats.end + 2,
    cha: player.stats.cha + 1,
    luk: player.stats.luk + 1,
  };

  const newMaxHp = player.maxHp + 10;
  const newMaxMp = player.maxMp + 5;

  return {
    ...player,
    level: newLevel,
    exp: player.exp - player.expToNextLevel,
    expToNextLevel: expToNextLevel(newLevel),
    stats: newStats,
    maxHp: newMaxHp,
    maxMp: newMaxMp,
    hp: newMaxHp,   // full restore on level up
    mp: newMaxMp,
  };
}
