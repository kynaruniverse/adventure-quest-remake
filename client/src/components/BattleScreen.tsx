import { useBattle } from '@/hooks/useBattle';
import { useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Sword, Wand2, Zap, Shield } from 'lucide-react';
import { Character, Monster } from '@/lib/gameEngine';
import { cn } from '@/lib/utils';

interface BattleScreenProps {
  player: Character;
  monster: Monster;
  onBattleEnd: (victory: boolean, rewards?: { exp: number; gold: number }) => void;
}

export default function BattleScreen({ player: initialPlayer, monster: initialMonster, onBattleEnd }: BattleScreenProps) {
  // Use the hook to drive the battle logic
  const { battleState, battleActive, executeAction } = useBattle();

  // Evolution: Link the battle victory back to the GameManager logic
  useEffect(() => {
    if (!battleActive) {
      const victory = battleState.monsterHp <= 0;
      if (victory) {
        onBattleEnd(true, { 
          exp: initialMonster.level * 25, 
          gold: initialMonster.level * 10 
        });
      } else if (battleState.playerHp <= 0) {
        onBattleEnd(false);
      }
    }
  }, [battleActive, battleState.monsterHp, battleState.playerHp, onBattleEnd, initialMonster]);

  // Evolution: Memoized percentages to prevent unnecessary re-renders
  const stats = useMemo(() => ({
    playerHp: (battleState.playerHp / initialPlayer.maxHp) * 100,
    playerMp: (initialPlayer.mp / initialPlayer.maxMp) * 100,
    monsterHp: (battleState.monsterHp / initialMonster.maxHp) * 100,
  }), [battleState.playerHp, battleState.monsterHp, initialPlayer, initialMonster]);

  return (
    <div className={cn(
      "h-full w-full flex flex-row overflow-hidden bg-slate-950 font-sans select-none p-2 gap-2 transition-colors duration-300",
      battleState.playerHp < initialPlayer.maxHp * 0.2 ? "bg-red-950/20" : "" // Evolution: Red vignette when low health
    )}>
      
      {/* LEFT COLUMN: Player Stats & Action Log (Thumb Zone 1) */}
      <div className="w-1/4 flex flex-col gap-2 z-20">
        <Card className="flex-none bg-slate-900/90 border-2 border-amber-600/50 p-2 shadow-xl backdrop-blur-md">
          <p className="text-[10px] font-black text-amber-500 uppercase mb-1">
            {initialPlayer.name} <span className="text-slate-400 font-normal ml-1">Lv.{initialPlayer.level}</span>
          </p>
          <div className="space-y-1.5">
            {/* Player Health Bar */}
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-green-500 transition-all duration-500 health-bar-shimmer" 
                style={{ width: `${Math.max(0, stats.playerHp)}%` }} 
              />
            </div>
            {/* Player Mana Bar */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-blue-500 transition-all duration-500" 
                style={{ width: `${stats.playerMp}%` }} 
              />
            </div>
          </div>
        </Card>

        {/* Vertical Battle Log */}
        <div className="flex-1 overflow-hidden bg-slate-950/80 rounded-lg border border-slate-800 backdrop-blur-sm p-2 flex flex-col justify-end shadow-inner">
          <div className="space-y-1 overflow-y-auto flex flex-col-reverse h-full custom-scrollbar">
            {[...battleState.battleLog].reverse().slice(0, 8).map((log, idx) => (
              <p key={idx} className={cn(
                "text-[10px] leading-tight",
                idx === 0 ? 'text-white font-bold animate-in fade-in slide-in-from-left-1' : 'text-slate-500'
              )}>
                {log}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* CENTER: The Arena Stage (Cinematic View) */}
      <main className="flex-1 relative flex items-center justify-between px-12 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-xl border-x border-slate-800 overflow-hidden">
        {/* Monster Display */}
        <div className="absolute top-8 right-12 w-48 text-right animate-in fade-in slide-in-from-top-4">
           <h2 className="text-lg font-black text-red-400 uppercase tracking-tighter mb-1">{initialMonster.name}</h2>
           <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="h-full bg-red-600 transition-all duration-500" 
                style={{ width: `${Math.max(0, stats.monsterHp)}%` }} 
              />
            </div>
        </div>

        {/* Dynamic Shadows/Visualizers */}
        <div className="w-32 h-12 bg-black/40 rounded-[100%] blur-xl absolute bottom-10 left-10" /> 
        <div className="w-32 h-12 bg-black/40 rounded-[100%] blur-xl absolute bottom-10 right-10" /> 
        
        <div className="text-4xl font-black text-slate-800/30 uppercase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-10deg] pointer-events-none select-none">
          Round {battleState.round}
        </div>
      </main>

      {/* RIGHT COLUMN: Command Deck (Thumb Zone 2) */}
      <nav className="w-1/5 flex flex-col gap-2 z-20">
        {battleActive ? (
          <>
            <Button 
              variant="retro"
              onClick={() => executeAction({ type: 'attack', target: 'monster' })}
              className="flex-1 bg-red-600/90 hover:bg-red-600 text-white border-b-4 border-red-950 flex flex-col justify-center items-center font-black"
            >
              <Sword size={22} className="mb-1" /> ATTACK
            </Button>
            <Button 
              variant="retro"
              onClick={() => executeAction({ type: 'spell', target: 'monster', value: 'spell-fireball' })}
              className="flex-1 bg-blue-600/90 hover:bg-blue-600 text-white border-b-4 border-blue-950 flex flex-col justify-center items-center font-black"
            >
              <Wand2 size={22} className="mb-1" /> SPELL
            </Button>
            <Button 
              variant="retro"
              onClick={() => executeAction({ type: 'item', target: 'player' })}
              className="flex-1 bg-green-600/90 hover:bg-green-600 text-white border-b-4 border-green-950 flex flex-col justify-center items-center font-black"
            >
              <Zap size={22} className="mb-1" /> ITEM
            </Button>
            <Button 
              variant="retro"
              onClick={() => executeAction({ type: 'defend', target: 'player' })}
              className="flex-1 bg-slate-700/90 hover:bg-slate-700 text-white border-b-4 border-slate-900 flex flex-col justify-center items-center font-black"
            >
              <Shield size={22} className="mb-1" /> DEFEND
            </Button>
          </>
        ) : (
          <Button 
            onClick={() => onBattleEnd(battleState.monsterHp <= 0)}
            className={cn(
              "h-full font-black uppercase tracking-tighter text-center py-4 animate-pulse border-b-4",
              battleState.monsterHp <= 0 ? "bg-amber-500 text-slate-900 border-amber-800" : "bg-red-600 text-white border-red-900"
            )}
          >
            {battleState.monsterHp <= 0 ? 'VICTORY' : 'DEFEAT'} <br/> 
            <span className="text-[10px] opacity-80">TAP TO CONTINUE</span>
          </Button>
        )}
      </nav>
    </div>
  );
}
