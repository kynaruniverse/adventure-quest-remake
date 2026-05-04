import { CombatEntity } from "./combatTypes";

export type AttackType = "melee" | "ranged" | "magic";

/**
 * =====================================================
 * UNIFIED EFFECT ENGINE — CORE MATH LAYER
 * =====================================================
 *
 * Deterministic calculation layer used by ALL systems:
 * Combat · Pets · Gear · Status effects · World buffs
 *
 * All systems feed modifiers INTO this engine.
 * calculateDamage delegates to resolveEffects internally —
 * modifier logic now lives in exactly one place.
 */

export type EffectModifiers = {
  flatDamage?: number;
  percentDamage?: number;
  accuracyBonus?: number;
  critBonus?: number;
  healBonus?: number;
  damageTakenMultiplier?: number;
};

export const gameEngine = {
  // ─── MODIFIER APPLICATION ────────────────────────────────
  /**
   * Single modifier pipeline. calculateDamage calls this —
   * nothing else needs to re-implement modifier logic.
   */
  resolveEffects: (base: number, modifiers: EffectModifiers = {}): number => {
    let result = base;

    if (modifiers.flatDamage) {
      result += modifiers.flatDamage;
    }

    if (modifiers.percentDamage) {
      result *= 1 + modifiers.percentDamage;
    }

    return Math.max(0, result);
  },

  // ─── DAMAGE CALCULATION ──────────────────────────────────
  /**
   * Core damage formula.
   * Reads stat from attacker based on attack type.
   * Applies variance ±10%.
   * Delegates modifier application to resolveEffects.
   */
  calculateDamage: (
    attacker: CombatEntity,
    base: number,
    type: AttackType,
    modifiers: EffectModifiers = {}
  ): number => {
    let stat = 0;

    switch (type) {
      case "melee":  stat = attacker.stats.str; break;
      case "ranged": stat = attacker.stats.dex; break;
      case "magic":  stat = attacker.stats.int; break;
    }

    const variance = Math.random() * 0.2 - 0.1;
    const rawDamage = (base + stat / 8) * (1 + variance);

    // Delegate to resolveEffects — single modifier pipeline
    return Math.max(1, Math.floor(
      gameEngine.resolveEffects(rawDamage, modifiers)
    ));
  },

  // ─── ACCURACY ────────────────────────────────────────────
  calculateAccuracy: (
    attacker: CombatEntity,
    base: number,
    type: AttackType,
    modifiers: EffectModifiers = {}
  ): number => {
    let stat = 0;

    switch (type) {
      case "melee":  stat = attacker.stats.str; break;
      case "ranged": stat = attacker.stats.dex; break;
      case "magic":  stat = attacker.stats.int; break;
    }

    const bonus = stat * 0.2 + (modifiers.accuracyBonus ?? 0);

    return Math.min(100, base + bonus);
  },

  // ─── HIT & CRIT ──────────────────────────────────────────
  isHit: (accuracy: number): boolean => {
    return Math.random() * 100 < accuracy;
  },

  isCritical: (luk: number, bonus = 0): boolean => {
    const chance = Math.min(25, luk / 10 + bonus);
    return Math.random() * 100 < chance;
  },

  applyCritical: (damage: number, multiplier = 1.5): number => {
    return Math.floor(damage * multiplier);
  },

  // ─── REWARD CALCULATION ──────────────────────────────────
  calculateVictoryRewards: (enemyLevel: number, difficulty = 1): {
    exp: number;
    gold: number;
  } => {
    const baseExp  = enemyLevel * 10 + difficulty * 5;
    const baseGold = enemyLevel * 3 + difficulty * 2;

    const expVariance  = Math.floor(Math.random() * 5);
    const goldVariance = Math.floor(Math.random() * 5);

    return {
      exp:  baseExp  + expVariance,
      gold: baseGold + goldVariance,
    };
  },
};
