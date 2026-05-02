import { useState } from 'react';
import { useBattle } from '@/hooks/useBattle';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sword, Wand2, Zap, Shield } from 'lucide-react';
import CharacterSheet from './CharacterSheet';

const FOREST_BG = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663416907555/F7RaCKdLLnV7JWigC8i7qU/aq-forest-bg-ASbK8PmNxgU3FxYdJKPZxv.webp';
const PLAYER_SPRITE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663416907555/F7RaCKdLLnV7JWigC8i7qU/aq-player-sprite-6mfudmfbLyGCFDKJBWWdeg.webp';
const MONSTER_SPRITE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663416907555/F7RaCKdLLnV7JWigC8i7qU/aq-monster-sprite-QdU8pwzhG56CHpmhYYNcDX.webp';

export default function ClassicBattleScreen() {
  const { player, monster, battleState, battleActive, executeAction, startNewBattle } = useBattle();
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
    <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: `url('${FOREST_BG}')` }}>
      {/* Forest Battle Arena */}
      <div className="flex-1 flex items-center justify-between px-8 py-12 relative">
        {/* Player Character - Left Side */}
        <div className="flex flex-col items-center animate-bounce" style={{ animationDuration: '3s' }}>
          <img
            src={PLAYER_SPRITE}
            alt={player.name}
            className="h-64 w-auto drop-shadow-lg"
          />
          <p className="text-white font-bold mt-2 text-shadow">{player.name}</p>
        </div>

        {/* Center Logo/Title */}
        <div className="flex flex-col items-center">
          <h1 className="text-5xl font-bold text-amber-400 drop-shadow-2xl text-shadow">
            Adventure<br />Quest
          </h1>
          <p className="text-white text-lg mt-2 drop-shadow-lg">Round {battleState.round}</p>
        </div>

        {/* Monster Character - Right Side */}
        <div className="flex flex-col items-center animate-pulse">
          <img
            src={MONSTER_SPRITE}
            alt={monster.name}
            className="h-64 w-auto drop-shadow-lg transform scale-x-[-1]"
          />
          <p className="text-red-400 font-bold mt-2 text-shadow">{monster.name}</p>
        </div>
      </div>

      {/* Bottom Status Panel */}
      <div className="bg-gradient-to-t from-slate-900 via-slate-800 to-transparent pt-8 px-4 pb-4">
        <div className="max-w-6xl mx-auto">
          {/* Status Bar Container */}
          <div className="flex items-center justify-between gap-4 mb-6">
            {/* Player Status */}
            <div className="flex items-center gap-4 flex-1">
              {/* Player Portrait */}
              <div className="w-24 h-24 rounded-full border-4 border-amber-500 bg-gradient-to-b from-amber-400 to-amber-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <div className="text-center">
                  <p className="text-white font-bold text-sm">Lv. {player.level}</p>
                  <p className="text-amber-900 text-xs">HP</p>
                </div>
              </div>

              {/* Player Stats */}
              <div className="flex-1 bg-slate-700 bg-opacity-80 rounded-lg p-3 border-2 border-amber-600">
                <p className="text-amber-300 font-bold text-lg">{player.name}</p>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 text-xs font-bold w-8">HP</span>
                    <div className="flex-1 bg-slate-900 rounded h-4 overflow-hidden border border-red-600">
                      <div
                        className="bg-red-600 h-full transition-all"
                        style={{ width: `${Math.max(0, playerHpPercent)}%` }}
                      />
                    </div>
                    <span className="text-red-400 text-xs font-bold">{Math.max(0, battleState.playerHp)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400 text-xs font-bold w-8">MP</span>
                    <div className="flex-1 bg-slate-900 rounded h-4 overflow-hidden border border-blue-600">
                      <div
                        className="bg-blue-600 h-full transition-all"
                        style={{ width: `${(player.mp / player.maxMp) * 100}%` }}
                      />
                    </div>
                    <span className="text-blue-400 text-xs font-bold">{player.mp}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 text-xs font-bold w-8">SP</span>
                    <div className="flex-1 bg-slate-900 rounded h-4 overflow-hidden border border-green-600">
                      <div
                        className="bg-green-600 h-full transition-all"
                        style={{ width: `${(player.sp / player.maxSp) * 100}%` }}
                      />
                    </div>
                    <span className="text-green-400 text-xs font-bold">{player.sp}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monster Status */}
            <div className="flex items-center gap-4 flex-1 flex-row-reverse">
              {/* Monster Portrait */}
              <div className="w-24 h-24 rounded-full border-4 border-red-500 bg-gradient-to-b from-red-400 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
                <div className="text-center">
                  <p className="text-white font-bold text-sm">Lv. {monster.level}</p>
                  <p className="text-red-900 text-xs">HP</p>
                </div>
              </div>

              {/* Monster Stats */}
              <div className="flex-1 bg-slate-700 bg-opacity-80 rounded-lg p-3 border-2 border-red-600 text-right">
                <p className="text-red-400 font-bold text-lg">{monster.name}</p>
                <div className="space-y-1 mt-2">
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="text-red-400 text-xs font-bold w-8">HP</span>
                    <div className="flex-1 bg-slate-900 rounded h-4 overflow-hidden border border-red-600">
                      <div
                        className="bg-red-600 h-full transition-all"
                        style={{ width: `${Math.max(0, monsterHpPercent)}%` }}
                      />
                    </div>
                    <span className="text-red-400 text-xs font-bold">{Math.max(0, battleState.monsterHp)}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="text-blue-400 text-xs font-bold w-8">MP</span>
                    <div className="flex-1 bg-slate-900 rounded h-4 overflow-hidden border border-blue-600">
                      <div
                        className="bg-blue-600 h-full transition-all"
                        style={{ width: `${(monster.mp / monster.maxMp) * 100}%` }}
                      />
                    </div>
                    <span className="text-blue-400 text-xs font-bold">{monster.mp}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-row-reverse">
                    <span className="text-green-400 text-xs font-bold w-8">SP</span>
                    <div className="flex-1 bg-slate-900 rounded h-4 overflow-hidden border border-green-600">
                      <div
                        className="bg-green-600 h-full transition-all"
                        style={{ width: '50%' }}
                      />
                    </div>
                    <span className="text-green-400 text-xs font-bold">N/A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Battle Log */}
          <div className="bg-slate-800 bg-opacity-90 rounded-lg p-3 mb-4 border-2 border-slate-600 h-20 overflow-y-auto">
            <div className="space-y-1">
              {battleState.battleLog.slice(-4).map((log, idx) => (
                <p key={idx} className="text-sm text-slate-300">
                  • {log}
                </p>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          {battleActive ? (
            <div className="grid grid-cols-4 gap-2">
              <Button
                onClick={() => executeAction({ type: 'attack', target: 'monster' })}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 flex items-center justify-center gap-2"
              >
                <Sword size={18} />
                Attack
              </Button>

              <Button
                onClick={() => setShowSpells(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 flex items-center justify-center gap-2"
              >
                <Wand2 size={18} />
                Spell
              </Button>

              <Button
                onClick={() => setShowItems(true)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 flex items-center justify-center gap-2"
              >
                <Zap size={18} />
                Item
              </Button>

              <Button
                onClick={() => executeAction({ type: 'defend', target: 'player' })}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 flex items-center justify-center gap-2"
              >
                <Shield size={18} />
                Defend
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400 mb-4">
                {battleState.playerHp <= 0 ? 'Battle Lost!' : 'Battle Won!'}
              </p>
              <Button
                onClick={startNewBattle}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 font-bold"
              >
                Start New Battle
              </Button>
            </div>
          )}

          {/* Additional Buttons */}
          <div className="flex gap-2 mt-3">
            <Button
              onClick={() => setShowCharacter(true)}
              variant="outline"
              className="flex-1 text-amber-400 border-amber-600"
            >
              Stats
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-amber-400 border-amber-600"
            >
              Options
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-amber-400 border-amber-600"
            >
              Nostalgia
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-amber-400 border-amber-600"
            >
              More
            </Button>
          </div>
        </div>
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

      <style>{`
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }
      `}</style>
    </div>
  );
}
