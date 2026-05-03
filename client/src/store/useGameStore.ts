import { create } from "zustand";
import { createDefaultPlayer } from "../lib/characterFactory";
import { createMonster } from "../lib/monsterFactory";
import { createStarterPet } from "../lib/petFactory";
import { applyPetPassive } from "../lib/petSystem";
import {
  playerTurn,
  enemyTurn,
} from "../lib/combatResolver";
import { Region } from "../lib/worldMap";

type Screen = "town" | "battle" | "shop" | "map";

type BattleState =
  | "idle"
  | "player-turn"
  | "enemy-turn"
  | "victory"
  | "defeat";

type GameState = {
  // 🧭 NAVIGATION
  screen: Screen;

  // 🧍 CORE ENTITIES
  player: ReturnType<typeof createDefaultPlayer>;
  enemy: ReturnType<typeof createMonster>;
  pet: ReturnType<typeof createStarterPet>;

  // ⚔️ BATTLE SYSTEM
  battleState: BattleState;
  battleLog: string[];

  // 🌍 WORLD SYSTEM
  region: Region | null;
  currentNodeId: string | null;

  // 🎮 NAVIGATION
  setScreen: (screen: Screen) => void;

  // ⚔️ BATTLE
  startBattle: (enemyLevel?: number) => void;
  playerTurn: (action: string) => void;
  nextEnemyTurn: () => void;
  resetBattle: () => void;

  // 🌍 WORLD
  setRegion: (region: Region) => void;
  setNode: (nodeId: string) => void;
  completeNode: (nodeId: string) => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  // 🧭 NAVIGATION
  screen: "town",

  // 🧍 ENTITIES
  player: createDefaultPlayer(),
  enemy: createMonster(1),
  pet: createStarterPet(),

  // ⚔️ BATTLE STATE
  battleState: "idle",
  battleLog: [],

  // 🌍 WORLD STATE
  region: null,
  currentNodeId: null,

  // =========================
  // NAVIGATION
  // =========================

  setScreen: (screen) => set({ screen }),

  // =========================
  // BATTLE FLOW
  // =========================

  startBattle: (enemyLevel = 1) => {
    const { pet } = get();

    const basePlayer = createDefaultPlayer();

    // 🐾 apply pet passive buffs BEFORE battle starts
    const enhancedPlayer = applyPetPassive(pet, basePlayer);

    set({
      screen: "battle",
      enemy: createMonster(enemyLevel),
      player: enhancedPlayer,
      battleState: "player-turn",
      battleLog: [],
    });
  },

  playerTurn: (action: string) => {
    const { player, enemy, battleState, pet } = get();

    if (battleState !== "player-turn") return;

    // 🐾 pet-enhanced player stats applied every turn
    const enhancedPlayer = applyPetPassive(pet, player);

    const result = playerTurn(enhancedPlayer, enemy, action);

    const updatedEnemy = result.enemy;

    let newState: BattleState = "enemy-turn";

    if (updatedEnemy.hp <= 0) {
      newState = "victory";
    }

    set({
      enemy: updatedEnemy,
      battleLog: [...get().battleLog, ...result.logs],
      battleState: newState,
    });

    if (newState === "enemy-turn") {
      setTimeout(() => get().nextEnemyTurn(), 400);
    }
  },

  nextEnemyTurn: () => {
    const { player, enemy } = get();

    const result = enemyTurn(enemy, player);

    let newState: BattleState = "player-turn";

    if (result.player.hp <= 0) {
      newState = "defeat";
    }

    set({
      player: result.player,
      enemy: result.enemy,
      battleLog: [...get().battleLog, result.log],
      battleState: newState,
    });
  },

  resetBattle: () => {
    set({
      player: createDefaultPlayer(),
      enemy: createMonster(1),
      pet: createStarterPet(),

      battleState: "idle",
      battleLog: [],
      screen: "town",
    });
  },

  // =========================
  // WORLD SYSTEM
  // =========================

  setRegion: (region) => set({ region }),

  setNode: (nodeId) => set({ currentNodeId: nodeId }),

  completeNode: (nodeId: string) => {
    const region = get().region;
    if (!region) return;

    const updatedNodes = region.nodes.map((node) => {
      if (node.id === nodeId) {
        return { ...node, completed: true };
      }

      if (node.connections.includes(nodeId)) {
        return { ...node, unlocked: true };
      }

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