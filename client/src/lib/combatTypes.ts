export type Element =
  | "fire"
  | "water"
  | "wind"
  | "ice"
  | "earth"
  | "energy"
  | "light"
  | "darkness";

export type CharacterStats = {
  str: number;
  dex: number;
  int: number;
  end: number;
  cha: number;
  luk: number;
};

export type Spell = {
  id: string;
  name: string;
  element: Element;
  cost: number;
  damage: number;
  accuracy: number;
  description: string;
};

export type PetType = "offensive" | "defensive" | "support";

export type Pet = {
  name: string;
  level: number;
  xp: number;
  maxXp: number;

  type: PetType;

  stats: {
    attack: number;
    defense: number;
  };
};