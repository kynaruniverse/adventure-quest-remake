/**
 * =========================
 * COMBAT TYPES — SINGLE SOURCE OF TRUTH
 * =========================
 *
 * All combat-relevant types live here.
 * gameData.ts uses ShopWeapon / ShopArmor for catalog items (different shape).
 * characterFactory.ts imports CharacterStats from here — no re-declaration.
 */

// ─── ELEMENTS ────────────────────────────────────────────────
export type Element =
  | "fire"
  | "water"
  | "wind"
  | "ice"
  | "earth"
  | "energy"
  | "light"
  | "darkness";

// ─── CORE STAT BLOCK ─────────────────────────────────────────
export type CharacterStats = {
  str: number;
  dex: number;
  int: number;
  end: number;
  cha: number;
  luk: number;
};

// ─── STATUS EFFECT ───────────────────────────────────────────
export interface StatusEffect {
  id: string;
  name: string;
  duration: number;
  damageTakenMultiplier?: number;
  skipTurn?: boolean;
  onTurn?: (entity: CombatEntity) => void;
}

// ─── COMBAT ENTITY ───────────────────────────────────────────
/**
 * Replaces `Entity = any`.
 * Both Player and Monster satisfy this interface structurally.
 * effectEngine.ts uses this type exclusively.
 */
export interface CombatEntity {
  id: string;
  name: string;
  level: number;

  stats: CharacterStats;

  hp: number;
  maxHp: number;

  effects: StatusEffect[];

  // State flags
  defending?: boolean;
  speed?: number;

  // Equipment bonuses (pre-computed by store before entering combat)
  equippedWeaponBonus?: number;        // flat damage added to attacks
  equippedArmorMultiplier?: number;    // damage taken multiplier (e.g. 0.9 = 10% reduction)

  // Pet reference (player only)
  pet?: import("./petTypes").Pet;

  // Monster-specific
  baseDamage?: number;
  element?: Element;
}

// ─── EQUIPMENT (EQUIPPED / IN-COMBAT SHAPES) ─────────────────
export type WeaponType = "melee" | "ranged" | "magic";

export type Weapon = {
  id: string;
  name: string;
  type: WeaponType;
  element: Element;
  damage: number;
  accuracy: number;
};

export type Armor = {
  id: string;
  name: string;
  defense: number;
};

// ─── SPELLS ──────────────────────────────────────────────────
export type Spell = {
  id: string;
  name: string;
  element: Element;
  cost: number;
  baseDamage: number;
  accuracy: number;
  scaling?: {
    int?: number;
    str?: number;
    dex?: number;
  };
  effects?: {
    status?: string;
    duration?: number;
  };
  description: string;
};

// ─── PET TYPES (re-export aliases kept for convenience) ──────
export type PetType = "offensive" | "defensive" | "support";
