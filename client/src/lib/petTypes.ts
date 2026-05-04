export type PetRarity = "common" | "rare" | "epic" | "legendary";

export type PetElement =
  | "fire"
  | "water"
  | "earth"
  | "wind"
  | "light"
  | "darkness";

/**
 * =========================
 * CORE PET STATS
 * =========================
 */
export interface PetStats {
  power: number;
  defense: number;
  agility: number;
  loyalty: number;
}

/**
 * =========================
 * EFFECT SYSTEM CORE
 * =========================
 */

export type PetTrigger =
  | "onAttack"
  | "onHit"
  | "onKill"
  | "onTurn"
  | "passive";

export type PetEffectType =
  | "damageBonus"
  | "heal"
  | "statBuff"
  | "shield"
  | "statusApply";

export interface PetEffect {
  type: PetEffectType;
  value: number;
  element?: PetElement;
}

/**
 * =========================
 * PET ABILITY SYSTEM
 * =========================
 */

export interface PetAbility {
  id: string;
  name: string;
  description: string;

  trigger: PetTrigger;

  effect: PetEffect;

  cooldown?: number;
}

/**
 * =========================
 * PET ENTITY
 * =========================
 */

export interface Pet {
  id: string;
  name: string;

  element: PetElement;
  rarity: PetRarity;

  level: number;
  exp: number;

  stats: PetStats;

  /**
   * 🧠 Now supports MULTIPLE abilities
   */
  abilities: PetAbility[];

  /**
   * runtime state hooks
   */
  bonded: boolean;

  cooldowns: Record<string, number>;

  status: any[];
}