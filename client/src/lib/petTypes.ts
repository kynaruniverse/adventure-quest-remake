/**
 * =========================
 * PET TYPES
 * =========================
 *
 * FIX BUG-03 (supporting): petSystem.ts was reading pet.ability (undefined).
 * It now correctly reads pet.abilities (this array).
 *
 * ADDED: cooldowns map on Pet — tracks per-ability cooldown state.
 * ADDED: PetAbility.id and PetAbility.cooldown fields (required by petSystem.ts).
 * ADDED: PetAbility.description for CharacterSheet display.
 */

import { PetType } from "./combatTypes";

export type PetAbilityEffect =
  | { type: "damageBonus";  value: number }
  | { type: "heal";         value: number }
  | { type: "statBuff";     stat: string; value: number }
  | { type: "shield";       value: number }
  | { type: "statusApply";  status: string; duration: number };

export type PetTrigger =
  | "onAttack"
  | "onHit"
  | "onKill"
  | "onTurn";

export type PetAbility = {
  id: string;
  name: string;
  description: string;
  trigger: PetTrigger;
  effect: PetAbilityEffect;
  cooldown?: number;   // turns between uses (0 or undefined = no cooldown)
};

export type PetStats = {
  power:   number;   // raw attack contribution
  agility: number;   // initiative / dodge
  defense: number;   // damage reduction
  spirit:  number;   // MP / healing contribution
};

export type Pet = {
  id: string;
  name: string;
  species: string;
  type: PetType;
  level: number;
  exp: number;
  expToNextLevel: number;

  stats: PetStats;

  // FIX BUG-03: petSystem.ts now reads `abilities` (was reading `ability`)
  abilities: PetAbility[];

  // Tracks current cooldown per ability.id — mutated by petSystem.ts
  cooldowns: Record<string, number>;
};
