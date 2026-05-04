/**
 * =========================
 * WORLD MAP TYPES
 * =========================
 *
 * WorldMapScreen.tsx reads: node.level, node.name, node.completed,
 * node.unlocked, node.connections.
 *
 * completeNode in useGameStore reads: node.connections.
 */

export type NodeType =
  | "battle"
  | "boss"
  | "shop"
  | "rest"
  | "event"
  | "start";

export type WorldNode = {
  id: string;
  name: string;
  type: NodeType;
  level: number;            // enemy level spawned for this node
  connections: string[];    // IDs of nodes unlocked when this is completed
  unlocked: boolean;
  completed: boolean;
  x?: number;               // optional for future visual map rendering
  y?: number;
};

export type Region = {
  id: string;
  name: string;
  description: string;
  nodes: WorldNode[];
  minLevel: number;
  maxLevel: number;
};
