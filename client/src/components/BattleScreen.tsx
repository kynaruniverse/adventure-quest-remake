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
    <div className="h-full w-full flex flex-row overflow-hidden bg-slate-950 font-sans select-none p-2 gap-2">
      
      {/* LEFT COLUMN: Player Stats & Action Log */}
      <div className="w-1/4 flex flex-col gap-2 z-20">
        <Card className="flex-none bg-slate-900/90 border-2 border-amber-600/50 p-2 shadow-xl backdrop-blur-md">
          <p className="text-[10px] font-black text-amber-500 uppercase mb-1">{player.name} <span className="text-slate-400 font-normal">Lv.{player.level}</span></p>
          <div className="space-y-1.5">
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${Math.max(0, playerHpPercent)}%` }} />
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(player.mp / player.maxMp) * 100}%` }} />
            </div>
          </div>
        </Card>

        {/* Vertical Battle Log */}
        <div className="flex-1 overflow-hidden bg-slate-950/80 rounded-lg border border-slate-800 backdrop-blur-sm p-2 flex flex-col justify-end shadow-inner">
          <div className="space-y-1 overflow-y-auto flex flex-col-reverse h-full">
            {[...battleState.battleLog].reverse().slice(0, 5).map((log, idx) => (
              <p key={idx} className={`text-[10px] leading-tight ${idx === 0 ? 'text-white font-bold' : 'text-slate-500'}`}>
                {log}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* CENTER: The Arena Stage */}
      <main className="flex-1 relative flex items-center justify-between px-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl border-x border-slate-800 overflow-hidden">
        {/* Monster HP bar floating above monster */}
        <div className="absolute top-8 right-12 w-48 text-right">
           <h2 className="text-lg font-black text-red-400 uppercase tracking-tighter mb-1">{monster.name}</h2>
           <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${Math.max(0, monsterHpPercent)}%` }} />
            </div>
        </div>

        {/* Visualization Placeholders (Where sprites will go) */}
        <div className="w-32 h-32 bg-slate-700/20 rounded-full blur-xl absolute bottom-10 left-10" /> {/* Player Shadow */}
        <div className="w-32 h-32 bg-red-900/20 rounded-full blur-xl absolute bottom-10 right-10" /> {/* Monster Shadow */}
        
        <div className="text-4xl font-black text-slate-800/50 uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] pointer-events-none">
          Round {battleState.round}
        </div>
      </main>

      {/* RIGHT COLUMN: Command Deck (Thumb Zone) */}
      <nav className="w-1/5 flex flex-col gap-2 z-20">
        {battleActive ? (
          <>
            <Button 
              onClick={() => executeAction({ type: 'attack', target: 'monster' })}
              className="flex-1 bg-red-600 hover:bg-red-700 border-r-4 border-red-900 active:border-r-0 active:translate-x-1 transition-all flex flex-col justify-center items-center font-black uppercase text-xs"
            >
              <Sword size={20} className="mb-1" /> Attack
            </Button>
            <Button 
              onClick={() => executeAction({ type: 'spell', target: 'monster', value: 'spell-fireball' })}
              className="flex-1 bg-orange-600 hover:bg-orange-700 border-r-4 border-orange-900 active:border-r-0 active:translate-x-1 transition-all flex flex-col justify-center items-center font-black uppercase text-xs"
            >
              <Wand2 size={20} className="mb-1" /> Spell
            </Button>
            <Button 
              onClick={() => executeAction({ type: 'item', target: 'player' })}
              className="flex-1 bg-green-600 hover:bg-green-700 border-r-4 border-green-900 active:border-r-0 active:translate-x-1 transition-all flex flex-col justify-center items-center font-black uppercase text-xs"
            >
              <Zap size={20} className="mb-1" /> Item
            </Button>
            <Button 
              onClick={() => executeAction({ type: 'defend', target: 'player' })}
              className="flex-1 bg-blue-600 hover:bg-blue-700 border-r-4 border-blue-900 active:border-r-0 active:translate-x-1 transition-all flex flex-col justify-center items-center font-black uppercase text-xs"
            >
              <Shield size={20} className="mb-1" /> Defend
            </Button>
          </>
        ) : (
          <Button 
            onClick={startNewBattle}
            className="h-full bg-amber-500 text-slate-900 font-black uppercase tracking-tighter text-center py-4"
          >
            Victory! <br/> Continue
          </Button>
        )}
      </nav>
    </div>
  );
}
