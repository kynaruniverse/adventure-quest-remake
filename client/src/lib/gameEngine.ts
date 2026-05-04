import { CharacterStats } from "./combatTypes";

export type AttackType = "melee" | "ranged" | "magic";

/**
 * =====================================================
 * UNIFIED EFFECT ENGINE (CORE MATH LAYER)
 * =====================================================
 *
 * This is NOT combat logic anymore.
 * This is the deterministic calculation layer that EVERYTHING uses:
 *
 * - Combat
 * - Pets
 * - Gear
 * - Status effects
 * - World buffs (future)
 *
 * All systems feed modifiers INTO this engine.
 */

/**
 * =========================
 * MODIFIER MODEL (STANDARD)
 * =========================
 */

export type EffectModifiers = {
  flatDamage?: number;
  percentDamage?: number;

  accuracyBonus?: number;

  critBonus?: number;

  healBonus?: number;

  damageTakenMultiplier?: number;
};

/**
 * =========================
 * CORE ENGINE
 * =========================
 */

export const gameEngine = {
  /**
   * -------------------------
   * DAMAGE CALCULATION
   * -------------------------
   */
  calculateDamage: (
    attacker: { stats: CharacterStats },
    base: number,
    type: AttackType,
    modifiers: EffectModifiers = {}
  ) => {
    let stat = 0;

    switch (type) {
      case "melee":
        stat = attacker.stats.str;
        break;
      case "ranged":
        stat = attacker.stats.dex;
        break;
      case "magic":
        stat = attacker.stats.int;
        break;
    }

    const variance = Math.random() * 0.2 - 0.1;

    let damage = (base + stat / 8) * (1 + variance);

    // flat bonus
    if (modifiers.flatDamage) {
      damage += modifiers.flatDamage;
    }

    // percent scaling
    if (modifiers.percentDamage) {
      damage *= 1 + modifiers.percentDamage;
    }

    return Math.max(1, Math.floor(damage));
  },

  /**
   * -------------------------
   * ACCURACY CALCULATION
   * -------------------------
   */
  calculateAccuracy: (
    attacker: { stats: CharacterStats },
    base: number,
    type: AttackType,
    modifiers: EffectModifiers = {}
  ) => {
    let stat = 0;

    switch (type) {
      case "melee":
        stat = attacker.stats.str;
        break;
      case "ranged":
        stat = attacker.stats.dex;
        break;
      case "magic":
        stat = attacker.stats.int;
        break;
    }

    const bonus = stat * 0.2;

    return Math.min(100, base + bonus + (modifiers.accuracyBonus ?? 0));
  },

  /**
   * -------------------------
   * HIT CHECK
   * -------------------------
   */
  isHit: (accuracy: number) => {
    return Math.random() * 100 < accuracy;
  },

  /**
   * -------------------------
   * CRITICAL SYSTEM
   * -------------------------
   */
  isCritical: (luk: number, bonus = 0) => {
    const chance = Math.min(25, luk / 10 + bonus);
    return Math.random() * 100 < chance;
  },

  applyCritical: (damage: number, multiplier = 1.5) => {
    return Math.floor(damage * multiplier);
  },

  /**
   * =====================================================
   * 🔥 CORE FUTURE HOOK (UEE ENTRY POINT)
   * =====================================================
   *
   * EVERYTHING will eventually pass through this:
   *
   * - status effects
   * - pets
   * - gear
   * - buffs
   * - debuffs
   *
   * DO NOT build multiple engines anymore.
   */
  resolveEffects: (
    base: number,
    modifiers: EffectModifiers = {}
  ) => {
    let result = base;

    if (modifiers.flatDamage) {
      result += modifiers.flatDamage;
    }

    if (modifiers.percentDamage) {
      result *= 1 + modifiers.percentDamage;
    }

    return result;
  },
};