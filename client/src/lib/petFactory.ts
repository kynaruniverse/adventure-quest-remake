import { Pet } from "./petTypes";

/**
 * =========================
 * PET FACTORY
 * =========================
 *
 * Creates concrete Pet instances.
 * All pets have the `abilities` array (plural) and `cooldowns` map.
 *
 * FIX BUG-03 (supporting):
 * Companion objects now match the Pet type that petSystem.ts reads.
 */

export function createStarterPet(): Pet {
  return {
    id: "pet-starter-1",
    name: "Sparky",
    species: "Flame Fox",
    type: "offensive",
    level: 1,
    exp: 0,
    expToNextLevel: 50,

    stats: {
      power:   8,
      agility: 10,
      defense: 4,
      spirit:  5,
    },

    abilities: [
      {
        id: "ember-bite",
        name: "Ember Bite",
        description: "+4 fire damage on attack",
        trigger: "onAttack",
        effect: { type: "damageBonus", value: 4 },
        cooldown: 0,
      },
    ],

    cooldowns: {},
  };
}

export function createPet(species: "wolf" | "spirit" | "golem"): Pet {
  switch (species) {
    case "wolf":
      return {
        id: `pet-wolf-${Date.now()}`,
        name: "Grey",
        species: "Shadow Wolf",
        type: "offensive",
        level: 1,
        exp: 0,
        expToNextLevel: 50,
        stats: { power: 12, agility: 14, defense: 4, spirit: 3 },
        abilities: [
          {
            id: "pack-strike",
            name: "Pack Strike",
            description: "+6 damage on every attack",
            trigger: "onAttack",
            effect: { type: "damageBonus", value: 6 },
            cooldown: 0,
          },
          {
            id: "bloodhound",
            name: "Bloodhound",
            description: "+8 damage bonus when enemy is below 50% HP",
            trigger: "onAttack",
            effect: { type: "damageBonus", value: 8 },
            cooldown: 3,
          },
        ],
        cooldowns: {},
      };

    case "spirit":
      return {
        id: `pet-spirit-${Date.now()}`,
        name: "Mist",
        species: "Spirit Owl",
        type: "support",
        level: 1,
        exp: 0,
        expToNextLevel: 50,
        stats: { power: 5, agility: 12, defense: 6, spirit: 14 },
        abilities: [
          {
            id: "spirit-mend",
            name: "Spirit Mend",
            description: "Heals 8 HP per turn",
            trigger: "onTurn",
            effect: { type: "heal", value: 8 },
            cooldown: 2,
          },
        ],
        cooldowns: {},
      };

    case "golem":
      return {
        id: `pet-golem-${Date.now()}`,
        name: "Crag",
        species: "Stone Golem",
        type: "defensive",
        level: 1,
        exp: 0,
        expToNextLevel: 50,
        stats: { power: 6, agility: 4, defense: 18, spirit: 4 },
        abilities: [
          {
            id: "stone-skin",
            name: "Stone Skin",
            description: "Reduces damage taken on hit",
            trigger: "onHit",
            effect: { type: "shield", value: 5 },
            cooldown: 0,
          },
        ],
        cooldowns: {},
      };
  }
}
