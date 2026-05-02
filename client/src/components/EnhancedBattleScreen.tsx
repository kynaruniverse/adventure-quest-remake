import { useState } from 'react';
import { useBattle } from '@/hooks/useBattle';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sword, Wand2, Zap, Shield } from 'lucide-react';
import CharacterSheet from './CharacterSheet';

interface EnhancedBattleScreenProps {
  player?: any;
  monster?: any;
  onBattleEnd?: (victory: boolean, rewards?: { exp: number; gold: number }) => void;
  onPlayerUpdate?: (player: any) => void;
}

export default function EnhancedBattleScreen(props?: EnhancedBattleScreenProps) {
  const { player: propsPlayer, monster: propsMonster, onBattleEnd, onPlayerUpdate } = props || {};
  const { player: statePlayer, monster: stateMonster, battleState, battleActive, executeAction, startNewBattle } = useBattle();
  const player = propsPlayer || statePlayer;
  const monster = propsMonster || stateMonster;
  const [showSpells, setShowSpells] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [showCharacter, setShowCharacter] = useState(false);

  const playerHpPercent = (battleState.playerHp / player.maxHp) * 100;
  const monsterHpPercent = (battleState.monsterHp / monster.maxHp) * 100;

  const handleSpellCast = (spellId: string) => {
    executeAction({ type: 'spell', target: 'monster', value: spellId });
    setShowSpells(false);
  };

  const handleItemUse = (itemId: string) => {
    executeAction({ type: 'item', target: 'player', value: itemId });
    setShowItems(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-amber-600 drop-shadow-lg">AdventureQuest</h1>
        <p className="text-slate-400 mt-1">Round {battleState.round}</p>
      </div>

      {/* Battle Arena */}
      <div className="grid grid-cols-2 gap-8 mb-8 max-w-4xl mx-auto">
        {/* Player Side */}
        <Card className="bg-slate-700 border-amber-600 border-2 p-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-amber-400">{player.name}</h2>
            <p className="text-slate-300 text-sm">Level {player.level}</p>
          </div>

          {/* Player Stats */}
          <div className="space-y-3 mb-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-200">HP</span>
                <span className="text-red-400">
                  {Math.max(0, battleState.playerHp)}/{player.maxHp}
                </span>
              </div>
              <Progress
                value={Math.max(0, playerHpPercent)}
                className="h-4 bg-slate-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-200">MP</span>
                <span className="text-blue-400">{player.mp}/{player.maxMp}</span>
              </div>
              <Progress
                value={(player.mp / player.maxMp) * 100}
                className="h-4 bg-slate-600"
              />
            </div>
          </div>

          {/* Player Stats Display */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4">
            <div>STR: {player.stats.str}</div>
            <div>DEX: {player.stats.dex}</div>
            <div>INT: {player.stats.int}</div>
            <div>END: {player.stats.end}</div>
          </div>

          <Button
            onClick={() => setShowCharacter(true)}
            className="w-full bg-slate-600 hover:bg-slate-500 text-slate-200"
            size="sm"
          >
            View Stats
          </Button>
        </Card>

        {/* Monster Side */}
        <Card className="bg-slate-700 border-red-600 border-2 p-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-red-400">{monster.name}</h2>
            <p className="text-slate-300 text-sm">Level {monster.level}</p>
          </div>

          {/* Monster Stats */}
          <div className="space-y-3 mb-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-200">HP</span>
                <span className="text-red-400">
                  {Math.max(0, battleState.monsterHp)}/{monster.maxHp}
                </span>
              </div>
              <Progress
                value={Math.max(0, monsterHpPercent)}
                className="h-4 bg-slate-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-200">MP</span>
                <span className="text-blue-400">{monster.mp}/{monster.maxMp}</span>
              </div>
              <Progress
                value={(monster.mp / monster.maxMp) * 100}
                className="h-4 bg-slate-600"
              />
            </div>
          </div>

          {/* Monster Element */}
          <div className="text-center text-xs text-slate-300">
            Element: <span className="capitalize text-amber-400">{monster.element}</span>
          </div>
        </Card>
      </div>

      {/* Battle Log */}
      <Card className="bg-slate-700 border-slate-600 border-2 p-4 mb-6 max-w-4xl mx-auto h-32 overflow-y-auto">
        <div className="space-y-1">
          {battleState.battleLog.slice(-8).map((log, idx) => (
            <p key={idx} className="text-sm text-slate-300">
              • {log}
            </p>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="max-w-4xl mx-auto">
        {battleActive ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              onClick={() => executeAction({ type: 'attack', target: 'monster' })}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
            >
              <Sword size={18} />
              Attack
            </Button>

            <Button
              onClick={() => setShowSpells(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center gap-2"
            >
              <Wand2 size={18} />
              Spell
            </Button>

            <Button
              onClick={() => setShowItems(true)}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
            >
              <Zap size={18} />
              Item
            </Button>

            <Button
              onClick={() => executeAction({ type: 'defend', target: 'player' })}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
            >
              <Shield size={18} />
              Defend
            </Button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xl font-bold text-amber-400 mb-4">
              {battleState.playerHp <= 0 ? 'Battle Lost!' : 'Battle Won!'}
            </p>
            <Button
              onClick={startNewBattle}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8"
            >
              Start New Battle
            </Button>
          </div>
        )}
      </div>

      {/* Spell Selection Dialog */}
      <Dialog open={showSpells} onOpenChange={setShowSpells}>
        <DialogContent className="bg-slate-700 border-amber-600 border-2">
          <DialogHeader>
            <DialogTitle className="text-amber-400">Select Spell</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {player.spells.map((spell: any) => (
              <Button
                key={spell.id}
                onClick={() => handleSpellCast(spell.id)}
                disabled={player.mp < spell.cost}
                className="w-full justify-start text-left h-auto p-3 bg-slate-600 hover:bg-slate-500 disabled:opacity-50"
              >
                <div>
                  <p className="font-bold text-blue-300">{spell.name}</p>
                  <p className="text-xs text-slate-400">
                    Cost: {spell.cost} MP | Damage: {spell.damage}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Selection Dialog */}
      <Dialog open={showItems} onOpenChange={setShowItems}>
        <DialogContent className="bg-slate-700 border-amber-600 border-2">
          <DialogHeader>
            <DialogTitle className="text-amber-400">Use Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {player.items.length > 0 ? (
              player.items.map((item: any) => (
                <Button
                  key={item.id}
                  onClick={() => handleItemUse(item.id)}
                  className="w-full justify-start text-left h-auto p-3 bg-slate-600 hover:bg-slate-500"
                >
                  <div>
                    <p className="font-bold text-green-300">{item.name}</p>
                    <p className="text-xs text-slate-400">
                      {item.effect} | Quantity: {item.quantity}
                    </p>
                  </div>
                </Button>
              ))
            ) : (
              <p className="text-slate-400 text-center py-4">No items available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Character Sheet Dialog */}
      <Dialog open={showCharacter} onOpenChange={setShowCharacter}>
        <DialogContent className="bg-slate-700 border-amber-600 border-2 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-amber-400">Character Sheet</DialogTitle>
          </DialogHeader>
          <CharacterSheet character={player} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
