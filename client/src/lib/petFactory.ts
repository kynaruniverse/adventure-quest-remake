import { Pet } from "./petTypes";

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

    ability: {
      name: "Warm Bite",
      description: "Adds fire damage on player attack",
      trigger: "onAttack",
      effect: "+3 fire damage",
    },

    bonded: true,
  };
}