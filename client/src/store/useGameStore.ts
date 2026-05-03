import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Character } from '../lib/gameEngine';

interface GameState {
  player: Character | null;
  setPlayer: (player: Character | null) => void;
  updateGold: (amount: number) => void;
  addXP: (amount: number) => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      player: null,
      setPlayer: (player) => set({ player }),
      updateGold: (amount) => set((state) => ({
        player: state.player ? { ...state.player, gold: state.player.gold + amount } : null
      })),
      addXP: (amount) => set((state) => {
        if (!state.player) return { player: null };
        const newXP = state.player.exp + amount;
        // Basic level up logic: level up every 100 XP
        const newLevel = Math.floor(newXP / 100) + 1;
        return {
          player: { 
            ...state.player, 
            exp: newXP, 
            level: newLevel > state.player.level ? newLevel : state.player.level 
          }
        };
      }),
      resetGame: () => {
        set({ player: null });
        localStorage.removeItem('adventure-quest-storage');
      },
    }),
    {
      name: 'adventure-quest-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
