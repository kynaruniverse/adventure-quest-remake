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

export type PetType = "offensive" | "defensive" | "support";

export type Pet = {
  id: string;

  name: string;
  element: Element;

  level: number;
  xp: number;
  maxXp: number;

  type: PetType;

  stats: {
    power: number;
    defense: number;
    agility: number;
    loyalty: number;
  };

  abilities: {
    id: string;
    name: string;
    trigger: "onAttack" | "onHit" | "onKill" | "onTurn";
    effect:
      | { type: "damageBonus"; value: number }
      | { type: "heal"; value: number }
      | { type: "statBuff"; stat: keyof CharacterStats; value: number }
      | { type: "shield"; value: number }
      | { type: "statusApply"; statusId: string };
  }[];
};

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