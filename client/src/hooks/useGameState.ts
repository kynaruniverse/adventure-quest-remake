import { useState, useCallback } from 'react';
import { Character, createDefaultPlayer } from '@/lib/gameEngine';

export type GameScreen = 'town' | 'battle';

export function useGameState() {
  const [screen, setScreen] = useState<GameScreen>('town');
  const [player, setPlayer] = useState<Character>(createDefaultPlayer());

  const goToBattle = useCallback(() => {
    pushScene({ type: "battle" });
  }, []);

  const goToTown = useCallback(() => {
    clearScenes();
  }, []);

  const restAtInn = useCallback(() => {
    setPlayer((prev) => ({
      ...prev,
      hp: prev.maxHp,
      mp: prev.maxMp,
      sp: prev.maxSp,
    }));
  }, []);

  const addExperience = useCallback((exp: number) => {
    setPlayer((prev) => {
      let newLevel = prev.level;
      let newExp = prev.exp + exp;

      // Simple leveling: 100 exp per level
      while (newExp >= 100) {
        newExp -= 100;
        newLevel += 1;
      }

      return {
        ...prev,
        level: newLevel,
        exp: newExp,
      };
    });
  }, []);

  const addGold = useCallback((gold: number) => {
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold + gold,
    }));
  }, []);

  return {
    screen,
    player,
    goToBattle,
    goToTown,
    restAtInn,
    addExperience,
    addGold,
  };
}
