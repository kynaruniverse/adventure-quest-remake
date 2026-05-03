export type NodeType =
  | "battle"
  | "elite"
  | "boss"
  | "rest"
  | "shop"
  | "event";

export interface MapNode {
  id: string;
  name: string;
  type: NodeType;
  level: number;
  enemyLevel?: number;
  unlocked: boolean;
  completed: boolean;
  connections: string[]; // adjacent nodes
}

export interface Region {
  id: string;
  name: string;
  description: string;
  recommendedLevel: number;

  nodes: MapNode[];

  bossNodeId: string;
  unlocked: boolean;
}