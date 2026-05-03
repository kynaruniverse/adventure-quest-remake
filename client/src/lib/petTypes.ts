export type PetRarity = "common" | "rare" | "epic" | "legendary";

export type PetElement =
  | "fire"
  | "water"
  | "earth"
  | "wind"
  | "light"
  | "darkness";

export interface PetStats {
  power: number;
  defense: number;
  agility: number;
  loyalty: number;
}

export interface Pet {
  id: string;
  name: string;
  element: PetElement;
  rarity: PetRarity;

  level: number;
  exp: number;

  stats: PetStats;

  ability: {
    name: string;
    description: string;
    trigger: "onAttack" | "onHit" | "onKill" | "passive";
    effect: string;
  };

  bonded: boolean;
}