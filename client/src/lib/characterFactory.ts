import { CHARACTER_CLASSES, CharacterClass } from "./characterClasses";
import { Pet } from "./combatTypes";

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

  pet: Pet;
};

export function createDefaultPlayer(): Player {
  return {
    id: "player-1",
    name: "Adventurer",

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

    gold: 100,

    pet: {
      name: "Sprig",
      level: 1,
      xp: 0,
      maxXp: 10,

      type: "offensive",

      stats: {
        attack: 4,
        defense: 2,
      },
    },
  };
}

export function createPlayerFromClass(
  name: string,
  selectedClass: CharacterClass
): Player {
  const classDef = CHARACTER_CLASSES[selectedClass];

  const baseHp = 50 + classDef.baseStats.end * 2;
  const baseMp = 30 + classDef.baseStats.int * 2;

  return {
    id: "player-1",
    name: name || "Adventurer",

    level: 1,
    exp: 0,

    stats: { ...classDef.baseStats },

    hp: baseHp,
    maxHp: baseHp,

    mp: baseMp,
    maxMp: baseMp,

    gold: 100,

    pet: {
      name: "Sprig",
      level: 1,
      xp: 0,
      maxXp: 10,

      type: "offensive",

      stats: {
        attack: 4,
        defense: 2,
      },
    },
  };
}