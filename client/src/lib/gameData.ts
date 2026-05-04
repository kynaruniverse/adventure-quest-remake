/**
 * =========================
 * GAME DATA — STATIC CATALOG
 * =========================
 *
 * Shop catalog types: ShopWeapon / ShopArmor
 * These are DIFFERENT from the in-combat Weapon/Armor in combatTypes.ts.
 * Shop items have price, level requirement, and effect objects.
 * Equipped items in combat are represented by the CombatEntity's
 * equippedWeaponBonus / equippedArmorMultiplier fields.
 */

// ─── SHOP CATALOG TYPES ──────────────────────────────────────

export type ShopWeapon = {
  id: string;
  name: string;
  type: "melee" | "ranged" | "magic";
  element: string;
  effect: {
    flatDamage: number;
    accuracyBonus?: number;
  };
  level: number;
  price: number;
};

export type ShopArmor = {
  id: string;
  name: string;
  defense: number;
  effect: {
    damageTakenMultiplier: number;
  };
  level: number;
  price: number;
};

// ─── SPELL CATALOG ───────────────────────────────────────────

export const SPELLS = {
  fireball: {
    id: "fireball",
    name: "Fireball",
    element: "fire",
    cost: 15,
    effect: {
      type: "damage",
      value: 20,
      accuracy: 85,
    },
    description: "Hurl a ball of fire at your enemy.",
  },

  heal: {
    id: "heal",
    name: "Heal",
    element: "light",
    cost: 10,
    effect: {
      type: "heal",
      value: 25,
      accuracy: 100,
    },
    description: "Restore your health.",
  },

  frostbolt: {
    id: "frostbolt",
    name: "Frostbolt",
    element: "water",
    cost: 12,
    effect: {
      type: "damage",
      value: 18,
      accuracy: 88,
      status: {
        type: "slow",
        duration: 2,
      },
    },
    description: "Launch a bolt of ice to slow your enemy.",
  },

  shield_bash: {
    id: "shield_bash",
    name: "Shield Bash",
    element: "earth",
    cost: 8,
    effect: {
      type: "damage",
      value: 12,
      accuracy: 95,
      status: {
        type: "stun",
        duration: 1,
      },
    },
    description: "Bash the enemy with your shield, stunning them.",
  },

  piercing_shot: {
    id: "piercing_shot",
    name: "Piercing Shot",
    element: "wind",
    cost: 10,
    effect: {
      type: "damage",
      value: 16,
      accuracy: 90,
    },
    description: "A shot that pierces enemy defenses.",
  },

  multi_shot: {
    id: "multi_shot",
    name: "Multi Shot",
    element: "wind",
    cost: 14,
    effect: {
      type: "damage",
      value: 10,
      accuracy: 80,
      hits: 3,
    },
    description: "Fire three rapid shots at the enemy.",
  },
} as const;

// ─── WEAPON CATALOG ──────────────────────────────────────────

export const WEAPONS: Record<string, ShopWeapon> = {
  sword_1: {
    id: "sword_1",
    name: "Iron Sword",
    type: "melee",
    element: "earth",
    effect: {
      flatDamage: 10,
      accuracyBonus: 0,
    },
    level: 1,
    price: 50,
  },

  bow_1: {
    id: "bow_1",
    name: "Wooden Bow",
    type: "ranged",
    element: "wind",
    effect: {
      flatDamage: 8,
      accuracyBonus: 5,
    },
    level: 1,
    price: 40,
  },

  staff_1: {
    id: "staff_1",
    name: "Mage Staff",
    type: "magic",
    element: "light",
    effect: {
      flatDamage: 12,
      accuracyBonus: 0,
    },
    level: 1,
    price: 60,
  },

  axe_2: {
    id: "axe_2",
    name: "Steel Axe",
    type: "melee",
    element: "earth",
    effect: {
      flatDamage: 18,
      accuracyBonus: -5,
    },
    level: 3,
    price: 120,
  },

  crossbow_2: {
    id: "crossbow_2",
    name: "Crossbow",
    type: "ranged",
    element: "wind",
    effect: {
      flatDamage: 15,
      accuracyBonus: 8,
    },
    level: 3,
    price: 100,
  },
};

// ─── ARMOR CATALOG ───────────────────────────────────────────

export const ARMORS: Record<string, ShopArmor> = {
  leather_1: {
    id: "leather_1",
    name: "Leather Armor",
    defense: 5,
    effect: {
      damageTakenMultiplier: 0.95,
    },
    level: 1,
    price: 30,
  },

  chain_1: {
    id: "chain_1",
    name: "Chain Mail",
    defense: 10,
    effect: {
      damageTakenMultiplier: 0.88,
    },
    level: 3,
    price: 100,
  },

  plate_2: {
    id: "plate_2",
    name: "Iron Plate",
    defense: 16,
    effect: {
      damageTakenMultiplier: 0.78,
    },
    level: 5,
    price: 200,
  },
};
