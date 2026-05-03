import { Region, MapNode } from "./worldMap";

export function createStarterRegion(): Region {
  const nodes: MapNode[] = [
    {
      id: "n1",
      name: "Forest Entry",
      type: "battle",
      level: 1,
      enemyLevel: 1,
      unlocked: true,
      completed: false,
      connections: ["n2"],
    },
    {
      id: "n2",
      name: "Deep Woods",
      type: "battle",
      level: 2,
      enemyLevel: 2,
      unlocked: false,
      completed: false,
      connections: ["n3"],
    },
    {
      id: "n3",
      name: "Ancient Clearing",
      type: "elite",
      level: 3,
      enemyLevel: 4,
      unlocked: false,
      completed: false,
      connections: ["boss"],
    },
    {
      id: "boss",
      name: "Forest Guardian",
      type: "boss",
      level: 5,
      enemyLevel: 6,
      unlocked: false,
      completed: false,
      connections: [],
    },
  ];

  return {
    id: "forest-1",
    name: "Whispering Forest",
    description: "A corrupted forest filled with wandering beasts.",
    recommendedLevel: 1,
    nodes,
    bossNodeId: "boss",
    unlocked: true,
  };
}