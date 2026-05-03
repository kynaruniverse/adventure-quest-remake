export const SPELLS = {
  fireball: {
    id: "fireball",
    name: "Fireball",
    element: "fire",
    cost: 15,
    damage: 20,
    accuracy: 85,
    description: "Hurl a ball of fire at your enemy.",
  },

  heal: {
    id: "heal",
    name: "Heal",
    element: "light",
    cost: 10,
    damage: 0,
    accuracy: 100,
    description: "Restore your health.",
  },

  frostbolt: {
    id: "frostbolt",
    name: "Frostbolt",
    element: "ice",
    cost: 12,
    damage: 18,
    accuracy: 88,
    description: "Launch a bolt of ice at your enemy.",
  },
};

export const WEAPONS = {
  sword_1: {
    id: "sword_1",
    name: "Iron Sword",
    type: "melee",
    element: "earth",
    damage: 10,
    accuracy: 85,
    level: 1,
    price: 50,
  },

  bow_1: {
    id: "bow_1",
    name: "Wooden Bow",
    type: "ranged",
    element: "wind",
    damage: 8,
    accuracy: 80,
    level: 1,
    price: 40,
  },

  staff_1: {
    id: "staff_1",
    name: "Mage Staff",
    type: "magic",
    element: "energy",
    damage: 12,
    accuracy: 85,
    level: 1,
    price: 60,
  },
};

export const ARMORS = {
  leather_1: {
    id: "leather_1",
    name: "Leather Armor",
    defense: 5,
    level: 1,
    price: 30,
  },

  chain_1: {
    id: "chain_1",
    name: "Chain Mail",
    defense: 10,
    level: 5,
    price: 100,
  },
};

export type Weapon = {
  id: string;
  name: string;
  type: "melee" | "ranged" | "magic";
  element: string;
  damage: number;
  accuracy: number;
  level: number;
  price: number;
};

export type Armor = {
  id: string;
  name: string;
  defense: number;
  level: number;
  price: number;
};