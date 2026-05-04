import { Region, WorldNode } from "./worldMap";

/**
 * =========================
 * WORLD GENERATOR
 * =========================
 *
 * Creates procedural or hand-crafted region data.
 * Nodes unlock via connections when the current node is completed.
 */

function makeNode(
  id: string,
  name: string,
  level: number,
  connections: string[],
  unlocked = false,
  completed = false,
  x?: number,
  y?: number,
): WorldNode {
  return {
    id, name, type: "battle",
    level, connections,
    unlocked, completed,
    x, y,
  };
}

/**
 * Starter Region — Verdant Wood.
 * A linear chain of 6 nodes with branching at node 3.
 *
 * Progression:
 *   [Start] → Node-1 → Node-2 → Node-3 → Node-4a (branch)
 *                                       → Node-4b (branch)
 *                                           ↘ Boss
 */
export function createStarterRegion(): Region {
  const nodes: WorldNode[] = [
    makeNode("start",  "Forest Entrance", 1,  ["n1"],          true,  false, 1, 3),
    makeNode("n1",     "Goblin Camp",     2,  ["n2"],          false, false, 2, 3),
    makeNode("n2",     "Mossy Ruins",     3,  ["n3a", "n3b"],  false, false, 3, 3),
    makeNode("n3a",    "River Crossing",  4,  ["boss"],        false, false, 4, 2),
    makeNode("n3b",    "Dark Thicket",    5,  ["boss"],        false, false, 4, 4),
    makeNode("boss",   "Ancient Grove",   6,  [],              false, false, 5, 3),
  ];

  return {
    id: "verdant-wood",
    name: "Verdant Wood",
    description: "An ancient forest, crawling with restless monsters.",
    nodes,
    minLevel: 1,
    maxLevel: 6,
  };
}

/**
 * Generates a random linear region of N nodes.
 * Used for future infinite dungeon / procedural mode.
 */
export function generateRegion(name: string, startLevel: number, length: number): Region {
  const nodes: WorldNode[] = [];

  for (let i = 0; i < length; i++) {
    const id = `node-${i}`;
    const nextId = `node-${i + 1}`;
    const connections = i < length - 1 ? [nextId] : [];
    const unlocked = i === 0;

    nodes.push({
      id,
      name: `Area ${i + 1}`,
      type: i === length - 1 ? "boss" : "battle",
      level: startLevel + i,
      connections,
      unlocked,
      completed: false,
    });
  }

  return {
    id: `region-${Date.now()}`,
    name,
    description: `A ${length}-stage challenge starting at level ${startLevel}.`,
    nodes,
    minLevel: startLevel,
    maxLevel: startLevel + length - 1,
  };
}
