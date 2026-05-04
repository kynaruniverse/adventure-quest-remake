import { create } from "zustand";
import { createDefaultPlayer } from "../lib/characterFactory";
import { createMonster } from "../lib/monsterFactory";
import { createStarterPet } from "../lib/petFactory";
import { runTurn, Action } from "../lib/effectEngine";
import { Region } from "../lib/worldMap";

export type SceneType =
  | "town"
  | "battle"
  | "shop"
  | "map"
  | "dialogue"
  | "cutscene";

export type Scene = {
  type: SceneType;
  data?: any;
};
/**
 * =========================
 * TYPES
 * =========================
 */

type BattleState =
  | "idle"
  | "player-turn"
  | "enemy-turn"
  | "victory"
  | "defeat";

type GameState = {
  sceneStack: Scene[];

  player: ReturnType<typeof createDefaultPlayer> & {
    pet: ReturnType<typeof createStarterPet>;
  };

  enemy: ReturnType<typeof createMonster>;

  battleState: BattleState;
  battleLog: string[];
  pushScene: (scene: Scene) => void;
  popScene: () => void;
  replaceScene: (scene: Scene) => void;
  clearScenes: () => void;

  region: Region | null;
  currentNodeId: string | null;

  startBattle: (enemyLevel?: number) => void;
  playerTurn: (action: Action) => void;
  resetBattle: () => void;

  setRegion: (region: Region) => void;
  setNode: (nodeId: string) => void;
  completeNode: (nodeId: string) => void;
};

/**
 * =========================
 * STORE
 * =========================
 */

export const useGameStore = create<GameState>((set, get) => ({

  player: {
    ...createDefaultPlayer(),
    pet: createStarterPet(),
  },

  enemy: createMonster(1),

  battleState: "idle",
  battleLog: [],

  region: null,
  currentNodeId: null,

  /**
   * =========================
   * BATTLE START
   * =========================
   */
  startBattle: (enemyLevel = 1) => {
    set({
      sceneStack: [...get().sceneStack, { type: "battle", data: { enemyLevel } }],
      enemy: createMonster(enemyLevel),
      player: {
        ...createDefaultPlayer(),
        pet: createStarterPet(),
      },
      battleState: "player-turn",
      battleLog: [],
    });
  },

  /**
   * =========================
   * PLAYER TURN
   * =========================
   */
  playerTurn: (action) => {
    const { player, enemy, battleState } = get();

    if (battleState !== "player-turn") return;

    const result = runTurn(player, enemy, action);

    const nextState: BattleState =
      result.enemy.hp <= 0
        ? "victory"
        : result.player.hp <= 0
        ? "defeat"
        : "enemy-turn";

    set({
      player: result.player,
      enemy: result.enemy,
      battleLog: [...get().battleLog, ...result.logs],
      battleState: nextState,
    });

    /**
     * =========================
     * ENEMY TURN
     * =========================
     */
    if (nextState === "enemy-turn") {
      setTimeout(() => {
        const { player, enemy } = get();

        const result = runTurn(enemy, player, "attack");

        const finalState: BattleState =
          result.player.hp <= 0 ? "defeat" : "player-turn";

        set({
          player: result.player,
          enemy: result.enemy,
          battleLog: [...get().battleLog, ...result.logs],
          battleState: finalState,
        });
      }, 400);
    }
  },

  resetBattle: () => {
    set({
      player: {
        ...createDefaultPlayer(),
        pet: createStarterPet(),
      },
      enemy: createMonster(1),
      battleState: "idle",
      battleLog: [],
      sceneStack: [{ type: "town" }],
    });
  },

  setRegion: (region) => set({ region }),
  setNode: (nodeId) => set({ currentNodeId: nodeId }),

  completeNode: (nodeId) => {
    const region = get().region;
    if (!region) return;

    const updatedNodes = region.nodes.map((node) => {
      if (node.id === nodeId) return { ...node, completed: true };
      if (node.connections.includes(nodeId)) return { ...node, unlocked: true };
      return node;
    });

    set({
      region: {
        ...region,
        nodes: updatedNodes,
      },
    });
  },
}));