import { useState, useCallback } from 'react';
import {
  Character,
  Monster,
  BattleAction,
  BattleState,
  createDefaultPlayer,
  createRandomMonster,
  processPlayerAction,
  processMonsterAction,
} from '@/lib/gameEngine';

export function useBattle() {
  const [player, setPlayer] = useState<Character>(createDefaultPlayer());
  const [monster, setMonster] = useState<Monster>(createRandomMonster(1));
  const [battleState, setBattleState] = useState<BattleState>({
    playerTurn: true,
    playerHp: player.hp,
    monsterHp: monster.hp,
    battleLog: ['Battle started!'],
    round: 1,
  });
  const [battleActive, setBattleActive] = useState(true);

  const executeAction = useCallback(
    (action: BattleAction) => {
      if (!battleActive) return;

      const newLog: string[] = [...battleState.battleLog];
      let newPlayerHp = battleState.playerHp;
      let newMonsterHp = battleState.monsterHp;

      // Player action
      const playerResult = processPlayerAction(player, monster, action);
      newLog.push(playerResult.log);
      if (playerResult.hit) {
        newMonsterHp -= playerResult.damage;
      }

      // Check if monster is defeated
      if (newMonsterHp <= 0) {
        newLog.push(`${monster.name} has been defeated!`);
        newLog.push(`You gained ${monster.drops.exp} experience and ${monster.drops.gold} gold!`);
        setBattleActive(false);
        setBattleState({
          ...battleState,
          playerHp: newPlayerHp,
          monsterHp: Math.max(0, newMonsterHp),
          battleLog: newLog,
        });
        return;
      }

      // Monster action
      const monsterResult = processMonsterAction(monster, player);
      newLog.push(monsterResult.log);
      if (monsterResult.hit) {
        newMonsterHp -= monsterResult.damage;
        newPlayerHp -= monsterResult.damage;
      }

      // Check if player is defeated
      if (newPlayerHp <= 0) {
        newLog.push('You have been defeated!');
        setBattleActive(false);
        setBattleState({
          ...battleState,
          playerHp: 0,
          monsterHp: Math.max(0, newMonsterHp),
          battleLog: newLog,
        });
        return;
      }

      setBattleState({
        playerTurn: true,
        playerHp: newPlayerHp,
        monsterHp: Math.max(0, newMonsterHp),
        battleLog: newLog,
        round: battleState.round + 1,
      });
    },
    [battleActive, battleState, player, monster]
  );

  const startNewBattle = useCallback(() => {
    const newPlayer = createDefaultPlayer();
    const newMonster = createRandomMonster(1);
    setPlayer(newPlayer);
    setMonster(newMonster);
    setBattleState({
      playerTurn: true,
      playerHp: newPlayer.hp,
      monsterHp: newMonster.hp,
      battleLog: ['Battle started!'],
      round: 1,
    });
    setBattleActive(true);
  }, []);

  return {
    player,
    monster,
    battleState,
    battleActive,
    executeAction,
    startNewBattle,
  };
}
