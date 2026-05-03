import { useBattle } from '@/hooks/useBattle';
import { useGameStore } from '@/store/useGameStore';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Sword, Wand2, Zap, Shield } from 'lucide-react';

export default function BattleScreen() {
  const { player, monster, battleState, battleActive, executeAction, startNewBattle } = useBattle();
  const updateGold = useGameStore((state) => state.updateGold);
  const addXP = useGameStore((state) => state.addXP);

  // Persistence: Save rewards when monster dies
  useEffect(() => {
    if (!battleActive && battleState.monsterHp <= 0) {
      updateGold(monster.level * 10); // Reward gold
      addXP(monster.level * 25);     // Reward XP
    }
  }, [battleActive, battleState.monsterHp]);

  const playerHpPercent = (battleState.playerHp / player.maxHp) * 100;
  const monsterHpPercent = (battleState.monsterHp / monster.maxHp) * 100;

  return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-slate-950 font-sans select-none">
      
      {/* 1. HUD (Top Bar) */}
      <header className="flex-none p-3 bg-slate-900 border-b-2 border-slate-800 flex justify-between items-center z-10 shadow-md">
        <h1 className="text-xl font-black text-amber-500 tracking-widest drop-shadow-sm uppercase">Round {battleState.round}</h1>
        <div className="flex gap-3 text-sm font-bold bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
          <span className="text-amber-400">Lv.{player.level}</span>
        </div>
      </header>

      {/* 2. Main Arena (Middle Screen - takes all remaining space) */}
      <main className="flex-1 relative flex flex-col justify-between p-4 bg-gradient-to-b from-slate-800 to-slate-900 overflow-hidden">
        
        {/* Monster Area (Top Right) */}
        <div className="flex flex-col items-end w-full animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="text-right mb-2">
            <h2 className="text-2xl font-black text-red-400 drop-shadow-lg">{monster.name}</h2>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{monster.element} Element</span>
          </div>
          
          <Card className="w-56 bg-slate-900/90 border-2 border-red-900/50 p-3 shadow-xl backdrop-blur-md">
            <div className="flex justify-between text-sm font-bold mb-1">
              <span className="text-slate-300">HP</span>
              <span className="text-red-400">{Math.max(0, battleState.monsterHp)} / {monster.maxHp}</span>
            </div>
            <div className="relative h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-red-600 transition-all duration-500" 
                style={{ width: `${Math.max(0, monsterHpPercent)}%` }}
              />
            </div>
          </Card>
        </div>

        {/* Player Area (Bottom Left) */}
        <div className="flex flex-col items-start w-full mt-auto mb-20 animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="mb-2">
            <h2 className="text-2xl font-black text-amber-400 drop-shadow-lg">{player.name}</h2>
          </div>
          
          <Card className="w-64 bg-slate-900/90 border-2 border-amber-600/50 p-3 shadow-xl backdrop-blur-md">
            {/* HP */}
            <div className="flex justify-between text-sm font-bold mb-1">
              <span className="text-slate-300">HP</span>
              <span className="text-green-400">{Math.max(0, battleState.playerHp)} / {player.maxHp}</span>
            </div>
            <div className="relative h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700 mb-3">
              <div 
                className="h-full bg-green-500 transition-all duration-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                style={{ width: `${Math.max(0, playerHpPercent)}%` }}
              />
            </div>
            
            {/* MP */}
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-slate-400">MP</span>
              <span className="text-blue-400">{player.mp} / {player.maxMp}</span>
            </div>
            <div className="relative h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${(player.mp / player.maxMp) * 100}%` }}
              />
            </div>
          </Card>
        </div>

        {/* Floating Battle Log (Sits over the arena floor) */}
        <div className="absolute inset-x-4 bottom-2 h-24 overflow-hidden bg-slate-950/80 rounded-lg border border-slate-800 backdrop-blur-sm p-3 flex flex-col justify-end shadow-inner pointer-events-none">
          <div className="space-y-1 overflow-y-auto flex flex-col-reverse h-full">
            {[...battleState.battleLog].reverse().slice(0, 3).map((log, idx) => (
              <p key={idx} className={`text-sm md:text-base ${idx === 0 ? 'text-white font-bold drop-shadow-md' : 'text-slate-500'}`}>
                {idx === 0 && <span className="text-amber-500 mr-2">▶</span>}
                {log}
              </p>
            ))}
          </div>
        </div>
      </main>

      {/* 3. Command Deck (Bottom Fixed) */}
      <footer className="flex-none bg-slate-950 border-t-4 border-slate-800 p-4 pb-8 z-10 shadow-[0_-10px_20px_rgba(0,0,0,0.4)]">
        {battleActive ? (
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            <Button 
              onClick={() => executeAction({ type: 'attack', target: 'monster' })}
              className="h-16 text-lg bg-red-600 hover:bg-red-700 border-b-4 border-red-900 active:border-b-0 active:translate-y-1 transition-all flex justify-center items-center gap-2 font-bold shadow-lg rounded-xl"
            >
              <Sword size={24} /> Attack
            </Button>
            <Button 
              onClick={() => executeAction({ type: 'spell', target: 'monster', value: 'spell-fireball' })}
              className="h-16 text-lg bg-orange-600 hover:bg-orange-700 border-b-4 border-orange-900 active:border-b-0 active:translate-y-1 transition-all flex justify-center items-center gap-2 font-bold shadow-lg rounded-xl"
            >
              <Wand2 size={24} /> Spell
            </Button>
            <Button 
              onClick={() => executeAction({ type: 'item', target: 'player' })}
              className="h-16 text-lg bg-green-600 hover:bg-green-700 border-b-4 border-green-900 active:border-b-0 active:translate-y-1 transition-all flex justify-center items-center gap-2 font-bold shadow-lg rounded-xl"
            >
              <Zap size={24} /> Item
            </Button>
            <Button 
              onClick={() => executeAction({ type: 'defend', target: 'player' })}
              className="h-16 text-lg bg-blue-600 hover:bg-blue-700 border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 transition-all flex justify-center items-center gap-2 font-bold shadow-lg rounded-xl"
            >
              <Shield size={24} /> Defend
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center max-w-md mx-auto">
            <p className="text-3xl font-black text-amber-400 mb-4 animate-pulse drop-shadow-xl uppercase tracking-widest">
              {battleState.playerHp <= 0 ? 'Defeated' : 'Victory!'}
            </p>
            <Button 
              onClick={startNewBattle}
              className="w-full h-16 text-xl bg-amber-500 hover:bg-amber-600 text-slate-900 border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 transition-all font-black shadow-xl rounded-xl uppercase tracking-wide"
            >
              Continue Adventure
            </Button>
          </div>
        )}
      </footer>
    </div>
  );
}
