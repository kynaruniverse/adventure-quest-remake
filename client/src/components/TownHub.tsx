import { useState } from 'react';
import { Character } from '@/lib/gameEngine';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Heart, Coins, Users, Sword, ShoppingBag, BedDouble, UserCircle } from 'lucide-react';
import CharacterSheet from './CharacterSheet';
import { cn } from '@/lib/utils';

interface TownHubProps {
  player: Character;
  onStartBattle: () => void;
  onRest: () => void;
  onVisitShop?: () => void;
}

export default function TownHub({ player, onStartBattle, onRest, onVisitShop }: TownHubProps) {
  const [showCharacter, setShowCharacter] = useState(false);

  return (
    <div className="h-full w-full flex flex-row overflow-hidden bg-slate-950 font-sans select-none p-2 gap-2">
      
      {/* 1. LEFT COLUMN: Hero Status (Thumb Zone) */}
      <aside className="w-1/4 flex flex-col gap-2 z-20">
        <Card className="flex-none bg-slate-900/90 border-2 border-amber-600/50 p-3 shadow-xl backdrop-blur-md">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-[10px] font-black text-amber-500 uppercase leading-none">Hero</p>
              <h1 className="text-sm font-black text-white uppercase tracking-tighter truncate">{player.name}</h1>
            </div>
            <p className="text-[10px] font-bold text-slate-400 italic">Lv.{player.level}</p>
          </div>

          <div className="space-y-2">
            {/* Health */}
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-bold uppercase">
                <span className="text-green-500">Health</span>
                <span className="text-slate-300">{player.hp}/{player.maxHp}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-green-500 transition-all duration-500 health-bar-shimmer" 
                  style={{ width: `${(player.hp / player.maxHp) * 100}%` }} 
                />
              </div>
            </div>

            {/* Mana */}
            <div className="space-y-1">
              <div className="flex justify-between text-[8px] font-bold uppercase">
                <span className="text-blue-400">Mana</span>
                <span className="text-slate-300">{player.mp}/{player.maxMp}</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500" 
                  style={{ width: `${(player.mp / player.maxMp) * 100}%` }} 
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Currency Card */}
        <Card className="bg-slate-900/50 border border-slate-800 p-2 flex items-center gap-3">
          <div className="p-2 bg-yellow-500/10 rounded-full border border-yellow-500/20">
            <Coins size={16} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-[8px] font-black text-slate-500 uppercase leading-none">Gold Coins</p>
            <p className="text-lg font-black text-yellow-500 leading-none">{player.gold}</p>
          </div>
        </Card>
      </aside>

      {/* 2. CENTER: The Town Plaza (Cinematic Backdrop) */}
      <main className="flex-1 relative flex items-center justify-center bg-[url('/assets/town-bg.jpg')] bg-cover bg-center rounded-xl border-x border-slate-800 overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
        
        {/* Animated Icon Glow */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-6 bg-amber-500/10 rounded-full border-2 border-amber-500/20 animate-pulse">
            <MapPin size={48} className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          </div>
          <h2 className="mt-4 text-4xl font-black text-white uppercase tracking-tighter italic drop-shadow-2xl">Falconreach</h2>
          <p className="text-[10px] text-amber-200/50 uppercase tracking-widest font-bold">Safe Zone • Town Center</p>
        </div>

        {/* Subtle Scanline Overlay specific to main area */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
      </main>

      {/* 3. RIGHT COLUMN: Navigation Menu (Thumb Zone) */}
      <nav className="w-1/5 flex flex-col gap-2 z-20">
        <Button 
          variant="retro"
          onClick={onStartBattle}
          className="flex-[2] bg-red-600 hover:bg-red-500 text-white border-b-4 border-red-950 flex flex-col items-center justify-center gap-1"
        >
          <Sword size={24} />
          <span className="font-black text-xs">ADVENTURE</span>
        </Button>

        <Button 
          variant="retro"
          onClick={onVisitShop}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-amber-500 border-b-4 border-slate-950 flex flex-col items-center justify-center gap-1"
        >
          <ShoppingBag size={20} />
          <span className="font-bold text-[10px]">SHOP</span>
        </Button>

        <Button 
          variant="retro"
          onClick={onRest}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-green-500 border-b-4 border-slate-950 flex flex-col items-center justify-center gap-1"
        >
          <BedDouble size={20} />
          <span className="font-bold text-[10px]">INN (REST)</span>
        </Button>

        <Button 
          variant="retro"
          onClick={() => setShowCharacter(true)}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-blue-400 border-b-4 border-slate-950 flex flex-col items-center justify-center gap-1"
        >
          <UserCircle size={20} />
          <span className="font-bold text-[10px]">CHARACTER</span>
        </Button>
      </nav>

      {/* Character Sheet Dialog - Evolution: Proper Landscape Fullscreen */}
      <Dialog open={showCharacter} onOpenChange={setShowCharacter}>
        <DialogContent className="bg-slate-950 border-amber-600/50 p-0 max-w-[90vw] h-[85vh] flex flex-col overflow-hidden">
          <DialogHeader className="p-3 border-b border-slate-800 bg-slate-900">
            <DialogTitle className="text-amber-500 font-black uppercase tracking-widest text-center text-sm">Hero Profile</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-slate-950">
            <CharacterSheet character={player} />
          </div>
          <footer className="p-3 bg-slate-900 border-t border-slate-800">
            <Button variant="retro" onClick={() => setShowCharacter(false)} className="w-full font-black uppercase">Close Menu</Button>
          </footer>
        </DialogContent>
      </Dialog>
    </div>
  );
}
