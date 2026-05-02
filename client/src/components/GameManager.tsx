import { useState, useCallback } from 'react';
import { Character, Monster, createDefaultPlayer, createRandomMonster } from '@/lib/gameEngine';
import { CharacterClass } from '@/lib/characterClasses';
import { WEAPONS, ARMORS } from '@/lib/gameData';
import ClassicBattleScreen from './ClassicBattleScreen';
import TownHub from './TownHub';
import Shop from './Shop';
import CharacterCreation from './CharacterCreation';

type GameScreen = 'creation' | 'town' | 'battle' | 'shop';

export default function GameManager() {
  const [screen, setScreen] = useState<GameScreen>('creation');
  const [player, setPlayer] = useState<Character>(createDefaultPlayer());
  const [monster, setMonster] = useState<Monster | null>(null);
  const [selectedClass, setSelectedClass] = useState<CharacterClass>('warrior');

  const handleCharacterCreated = useCallback((character: Character, classType: CharacterClass) => {
    setPlayer(character);
    setSelectedClass(classType);
    setScreen('town');
  }, []);

  const handleStartBattle = useCallback(() => {
    const newMonster = createRandomMonster(player.level);
    setMonster(newMonster);
    setScreen('battle');
  }, [player.level]);

  const handleBattleEnd = useCallback(
    (victory: boolean, rewards?: { exp: number; gold: number }) => {
      if (victory && rewards) {
        setPlayer((prev) => {
          let newLevel = prev.level;
          let newExp = prev.exp + rewards.exp;

          // Simple leveling: 100 exp per level
          while (newExp >= 100) {
            newExp -= 100;
            newLevel += 1;
          }

          return {
            ...prev,
            level: newLevel,
            exp: newExp,
            gold: prev.gold + rewards.gold,
            hp: Math.min(prev.maxHp, prev.hp + 10), // Partial heal after battle
          };
        });
      }
      setScreen('town');
    },
    []
  );

  const handleRest = useCallback(() => {
    setPlayer((prev) => ({
      ...prev,
      hp: prev.maxHp,
      mp: prev.maxMp,
      sp: prev.maxSp,
    }));
  }, []);

  const handlePurchaseWeapon = useCallback((weaponId: string) => {
    const weapon = WEAPONS[weaponId];
    if (!weapon) return;

    if (player.gold >= weapon.price) {
      setPlayer((prev) => ({
        ...prev,
        gold: prev.gold - weapon.price,
        equipment: {
          ...prev.equipment,
          weapon: weaponId,
        },
      }));
    }
  }, [player.gold]);

  const handlePurchaseArmor = useCallback((armorId: string) => {
    const armor = ARMORS[armorId];
    if (!armor) return;

    if (player.gold >= armor.price) {
      setPlayer((prev) => ({
        ...prev,
        gold: prev.gold - armor.price,
        equipment: {
          ...prev.equipment,
          armor: armorId,
        },
      }));
    }
  }, [player.gold]);

  return (
    <>
      {screen === 'creation' ? (
        <CharacterCreation onCharacterCreated={handleCharacterCreated} />
      ) : screen === 'town' ? (
        <TownHub
          player={player}
          onStartBattle={handleStartBattle}
          onRest={handleRest}
          onVisitShop={() => setScreen('shop')}
        />
      ) : screen === 'shop' ? (
        <Shop
          player={player}
          weapons={Object.values(WEAPONS)}
          armors={Object.values(ARMORS)}
          onPurchaseWeapon={handlePurchaseWeapon}
          onPurchaseArmor={handlePurchaseArmor}
        />
      ) : monster ? (
        <ClassicBattleScreen />
      ) : null}
    </>
  );
}
