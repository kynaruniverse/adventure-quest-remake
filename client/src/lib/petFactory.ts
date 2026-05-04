import { Pet } from "./petTypes";

/**
 * =========================
 * STARTER PET FACTORY
 * =========================
 *
 * Pets are now designed as EFFECT ENTITIES
 * compatible with:
 * - combat engine
 * - status system
 * - future AI turns
 */

export function createStarterPet(): Pet {
  return {
    id: "pet-1",
    name: "Ember Pup",

    element: "fire",
    rarity: "common",

    level: 1,
    exp: 0,

    stats: {
      power: 5,
      defense: 3,
      agility: 4,
      loyalty: 10,
    },

    /**
     * =========================
     * EFFECT SYSTEM DESIGN
     * =========================
     *
     * Replaces single rigid ability system
     * with scalable trigger-based design
     */
    abilities: [
      {
        id: "warm-bite",
        name: "Warm Bite",
        description: "Adds fire damage on player attack",

        trigger: "onAttack",

        effect: {
          type: "damageBonus",
          value: 3,
          element: "fire",
        },
      },
    ],

    /**
     * =========================
     * RUNTIME STATE HOOKS
     * =========================
     */
    bonded: true,

    cooldowns: {},

    status: [],
  };
}