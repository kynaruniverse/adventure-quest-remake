import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { createDefaultPlayer, createPlayerFromClass, applyLevelUp, Player } from "../lib/characterFactory";
import { createMonster } from "../lib/monsterFactory";
import { createStarterPet } from "../lib/petFactory";
import { runTurn, runEnemyTurn, Action } from "../lib/effectEngine";
import { gameEngine } from "../lib/gameEngine";
import { Region } from "../lib/worldMap";
import { CharacterClass } from "../lib/characterClasses";
import { WEAPONS, ARMORS } from "../lib/gameData";
import { CombatEntity } from "../lib/combatTypes";
import { Pet } from "../lib/petTypes";

/**
 * =========================
 * SCENE TYPES
 * =========================
 */
export type SceneType =
  | "character-creation"
  | "town"
  | "battle"
  | "shop"
  | "map"
  | "character-sheet"
  | "dialogue"
  | "cutscene";

export type Scene = {
  type: SceneType;
  data?: Record<string, unknown>;
};

/**
 * =========================
 * BATTLE STATE
 * =========================
 */
type BattleState = "idle" | "player-turn" | "enemy-turn" | "victory" | "defeat";

/**
 * =========================
 * INVENTORY
 * =========================
 */
export type Inventory = {
  weaponIds: string[];
  armorIds: string[];
  equippedWeaponId: string | null;
  equippedArmorId: string | null;
};

/**
 * =========================
 * GAME STATE INTERFACE
 * =========================
 */
type GameState = {
  // ─── Meta ─────────────────────────────────────────────────
  gameStarted: boolean;

  // ─── Scene Stack ──────────────────────────────────────────
  sceneStack: Scene[];
  pushScene: (scene: Scene) => void;
  popScene: () => void;
  replaceScene: (scene: Scene) => void;
  clearScenes: () => void;

  // ─── Player ───────────────────────────────────────────────
  player: Player & { pet: Pet };
  initializePlayer: (player: Player, selectedClass: CharacterClass) => void;
  setPlayer: (player: Player) => void;
  addExperience: (exp: number) => boolean; // returns true if levelled up
  addGold: (gold: number) => void;
  spendGold: (amount: number) => boolean;  // returns false if insufficient
  restAtInn: () => boolean;
  newGame: () => void;

  // ─── Inventory ────────────────────────────────────────────
  inventory: Inventory;
  purchaseWeapon: (id: string) => { success: boolean; message: string };
  purchaseArmor:  (id: string) => { success: boolean; message: string };
  equipWeapon: (id: string) => void;
  equipArmor:  (id: string) => void;

  // ─── Enemy ────────────────────────────────────────────────
  enemy: CombatEntity;

  // ─── Battle ───────────────────────────────────────────────
  battleState: BattleState;
  battleLog: string[];
  lastRewards: { exp: number; gold: number; leveledUp: boolean } | null;
  startBattle: (enemyLevel?: number, difficulty?: number) => void;
  playerTurn: (action: Action) => void;
  resetBattle: () => void;

  // ─── World Map ────────────────────────────────────────────
  region: Region | null;
  currentNodeId: string | null;
  setRegion: (region: Region) => void;
  setNode: (nodeId: string) => void;
  completeNode: (nodeId: string) => void;
};

// ─── INITIAL VALUES ──────────────────────────────────────────

const defaultPlayer = (): Player & { pet: Pet } => ({
  ...createDefaultPlayer(),
  pet: createStarterPet(),
});

const defaultInventory = (): Inventory => ({
  weaponIds: [],
  armorIds: [],
  equippedWeaponId: null,
  equippedArmorId: null,
});

// ─── STORE ───────────────────────────────────────────────────

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({

      // ─── Meta ───────────────────────────────────────────────
      gameStarted: false,

      // ─── Scene Stack ────────────────────────────────────────
      // FIX BUG-01: sceneStack was not initialised (was undefined).
      // Starts at character-creation; replaced with town after init.
      sceneStack: [{ type: "character-creation" }],

      pushScene: (scene) =>
        set({ sceneStack: [...get().sceneStack, scene] }),

      popScene: () => {
        const stack = get().sceneStack;
        if (stack.length > 1) {
          set({ sceneStack: stack.slice(0, -1) });
        }
      },

      replaceScene: (scene) => {
        const stack = get().sceneStack;
        set({ sceneStack: [...stack.slice(0, -1), scene] });
      },

      clearScenes: () =>
        set({ sceneStack: [{ type: "town" }] }),

      // ─── Player ─────────────────────────────────────────────
      player: defaultPlayer(),

      /**
       * Called by CharacterCreation on submit.
       * Sets player, marks game as started, navigates to town.
       */
      initializePlayer: (player, _selectedClass) => {
        set({
          player: { ...player, pet: createStarterPet() },
          inventory: defaultInventory(),
          gameStarted: true,
          sceneStack: [{ type: "town" }],
          battleLog: [],
          battleState: "idle",
          lastRewards: null,
        });
      },

      setPlayer: (player) =>
        set({ player: { ...player, pet: get().player.pet } }),

      /**
       * Awards experience. Handles multi-level-up.
       * Returns true if a level-up occurred.
       */
      addExperience: (exp) => {
        let current = get().player;
        let leveledUp = false;

        current = { ...current, exp: current.exp + exp };

        while (current.exp >= current.expToNextLevel) {
          current = applyLevelUp(current) as Player & { pet: Pet };
          leveledUp = true;
        }

        set({ player: current });
        return leveledUp;
      },

      addGold: (gold) =>
        set({ player: { ...get().player, gold: get().player.gold + gold } }),

      spendGold: (amount) => {
        const player = get().player;
        if (player.gold < amount) return false;
        set({ player: { ...player, gold: player.gold - amount } });
        return true;
      },

      /**
       * Rest at the inn: costs 10 gold, restores full HP/MP.
       * Returns false if not enough gold.
       */
      restAtInn: () => {
        const player = get().player;
        if (player.gold < 10) return false;
        set({
          player: {
            ...player,
            hp: player.maxHp,
            mp: player.maxMp,
            gold: player.gold - 10,
          },
        });
        return true;
      },

      newGame: () => {
        set({
          player: defaultPlayer(),
          inventory: defaultInventory(),
          gameStarted: false,
          sceneStack: [{ type: "character-creation" }],
          enemy: createMonster(1),
          battleState: "idle",
          battleLog: [],
          lastRewards: null,
          region: null,
          currentNodeId: null,
        });
      },

      // ─── Inventory ──────────────────────────────────────────

      inventory: defaultInventory(),

      purchaseWeapon: (id) => {
        const weapon = WEAPONS[id];
        if (!weapon) return { success: false, message: "Item not found." };

        const player = get().player;
        const inv    = get().inventory;

        if (inv.weaponIds.includes(id)) {
          return { success: false, message: "You already own this weapon." };
        }
        if (player.gold < weapon.price) {
          return { success: false, message: "Not enough gold." };
        }
        if (player.level < weapon.level) {
          return { success: false, message: `Requires level ${weapon.level}.` };
        }

        get().spendGold(weapon.price);
        set({ inventory: { ...inv, weaponIds: [...inv.weaponIds, id] } });
        get().equipWeapon(id);

        return { success: true, message: `${weapon.name} purchased!` };
      },

      purchaseArmor: (id) => {
        const armor = ARMORS[id];
        if (!armor) return { success: false, message: "Item not found." };

        const player = get().player;
        const inv    = get().inventory;

        if (inv.armorIds.includes(id)) {
          return { success: false, message: "You already own this armor." };
        }
        if (player.gold < armor.price) {
          return { success: false, message: "Not enough gold." };
        }
        if (player.level < armor.level) {
          return { success: false, message: `Requires level ${armor.level}.` };
        }

        get().spendGold(armor.price);
        set({ inventory: { ...inv, armorIds: [...inv.armorIds, id] } });
        get().equipArmor(id);

        return { success: true, message: `${armor.name} purchased!` };
      },

      /**
       * Equip a weapon: pre-computes the flatDamage bonus and stores it
       * on the player entity so effectEngine never needs shop data.
       */
      equipWeapon: (id) => {
        const weapon = WEAPONS[id];
        if (!weapon) return;

        const player = get().player;
        set({
          inventory: { ...get().inventory, equippedWeaponId: id },
          player: {
            ...player,
            equippedWeaponBonus: weapon.effect.flatDamage,
          },
        });
      },

      equipArmor: (id) => {
        const armor = ARMORS[id];
        if (!armor) return;

        const player = get().player;
        set({
          inventory: { ...get().inventory, equippedArmorId: id },
          player: {
            ...player,
            equippedArmorMultiplier: armor.effect.damageTakenMultiplier,
          },
        });
      },

      // ─── Enemy ──────────────────────────────────────────────
      enemy: createMonster(1),

      // ─── Battle ─────────────────────────────────────────────
      battleState: "idle",
      battleLog: [],
      lastRewards: null,

      /**
       * FIX BUG-07: startBattle no longer resets the player to defaults.
       * The existing player (with class, stats, gold, etc.) is preserved.
       * Only the enemy is (re-)created.
       */
      startBattle: (enemyLevel, difficulty = 1) => {
        const level = enemyLevel ?? get().player.level;
        set({
          sceneStack: [...get().sceneStack, { type: "battle", data: { enemyLevel: level } }],
          enemy: createMonster(level, difficulty),
          battleState: "player-turn",
          battleLog: ["⚔ Battle begins!"],
          lastRewards: null,
        });
      },

      /**
       * FIX BUG-02: Entity swap fixed.
       *
       * runTurn returns { attacker, defender }.
       * - Player turn: player=attacker, enemy=defender
       *   → store.player = result.attacker, store.enemy = result.defender ✓
       *
       * FIX BUG-08: Enemy turn via runEnemyTurn (separate fn).
       * Returns { updatedPlayer, updatedEnemy } — unambiguous names.
       */
      playerTurn: (action) => {
        const { player, enemy, battleState } = get();

        if (battleState !== "player-turn") return;

        // ── Player action ──────────────────────────────────────
        const result = runTurn(player as CombatEntity, enemy, action);

        // result.attacker = updated player (first arg)
        // result.defender = updated enemy (second arg)
        const updatedPlayer = result.attacker as Player & { pet: Pet };
        const updatedEnemy  = result.defender;

        const afterPlayerState: BattleState =
          updatedEnemy.hp  <= 0 ? "victory" :
          updatedPlayer.hp <= 0 ? "defeat"  : "enemy-turn";

        set({
          player:      updatedPlayer,
          enemy:       updatedEnemy,
          battleLog:   [...get().battleLog, ...result.logs],
          battleState: afterPlayerState,
        });

        // ── Victory resolution ────────────────────────────────
        if (afterPlayerState === "victory") {
          const difficulty = (get().sceneStack.find(s => s.type === "battle")?.data?.difficulty as number) ?? 1;
          const rewards = gameEngine.calculateVictoryRewards(enemy.level, difficulty);
          const leveledUp = get().addExperience(rewards.exp);
          get().addGold(rewards.gold);

          set({
            lastRewards: { ...rewards, leveledUp },
          });
          return;
        }

        if (afterPlayerState === "defeat") return;

        // ── Enemy turn (delayed for visual pacing) ─────────────
        setTimeout(() => {
          const { player: p, enemy: e, battleState: bs } = get();
          if (bs !== "enemy-turn") return;

          const enemyResult = runEnemyTurn(e, p as CombatEntity);

          const finalPlayer = enemyResult.updatedPlayer as Player & { pet: Pet };
          const finalEnemy  = enemyResult.updatedEnemy;

          const finalState: BattleState =
            finalPlayer.hp <= 0 ? "defeat" : "player-turn";

          set({
            player:      finalPlayer,
            enemy:       finalEnemy,
            battleLog:   [...get().battleLog, ...enemyResult.logs],
            battleState: finalState,
          });
        }, 600);
      },

      resetBattle: () => {
        // Return to town, preserve player progress
        set({
          battleState: "idle",
          battleLog: [],
          lastRewards: null,
          enemy: createMonster(1),
          sceneStack: [{ type: "town" }],
        });
      },

      // ─── World Map ──────────────────────────────────────────
      region: null,
      currentNodeId: null,

      setRegion: (region) => set({ region }),
      setNode:   (nodeId) => set({ currentNodeId: nodeId }),

      completeNode: (nodeId) => {
        const region = get().region;
        if (!region) return;

        const updatedNodes = region.nodes.map((node) => {
          if (node.id === nodeId) return { ...node, completed: true };
          if (node.connections.includes(nodeId)) return { ...node, unlocked: true };
          return node;
        });

        set({ region: { ...region, nodes: updatedNodes } });
      },
    }),

    {
      name: "adventure-quest-save-v1",
      storage: createJSONStorage(() => localStorage),

      /**
       * Only persist meaningful state.
       * sceneStack, battleState, and battleLog are session-only —
       * we never want to restore mid-battle.
       */
      partialize: (state) => ({
        gameStarted:  state.gameStarted,
        player:       state.player,
        inventory:    state.inventory,
        region:       state.region,
        currentNodeId: state.currentNodeId,
      }),

      /**
       * On rehydration: if the player has already started the game,
       * land them at town (not the mid-battle scene that may have
       * been active when they closed the tab).
       */
      onRehydrateStorage: () => (state) => {
        if (state?.gameStarted) {
          state.sceneStack    = [{ type: "town" }];
          state.battleState   = "idle";
          state.battleLog     = [];
          state.lastRewards   = null;
          state.enemy         = createMonster(1);
        }
      },
    }
  )
);
