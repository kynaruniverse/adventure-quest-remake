import { useState } from 'react';
import { Character } from '@/lib/gameEngine';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Heart, Coins, Users, Sword } from 'lucide-react';
import CharacterSheet from './CharacterSheet';

interface TownHubProps {
  player: Character;
  onStartBattle: () => void;
  onRest: () => void;
  onVisitShop?: () => void;
}

export default function TownHub({ player, onStartBattle, onRest, onVisitShop }: TownHubProps) {
  const [showCharacter, setShowCharacter] = useState(false);

    return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-slate-950 select-none">
      
      {/* 1. HUD (Top Bar) */}
      <header className="flex-none p-4 bg-slate-900 border-b-2 border-slate-800 flex justify-between items-center z-10 shadow-lg">
        <div>
          <h1 className="text-xl font-black text-amber-500 uppercase tracking-widest leading-none">BattleOn</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{player.name}</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-slate-800 px-3 py-1 rounded border border-slate-700 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Gold</p>
            <p className="text-sm font-black text-yellow-500 leading-none">{player.gold}</p>
          </div>
          <div className="bg-slate-800 px-3 py-1 rounded border border-slate-700 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase">Level</p>
            <p className="text-sm font-black text-amber-400 leading-none">{player.level}</p>
          </div>
        </div>
      </header>

      {/* 2. Central Hub Visual (Arena Space) */}
      <main className="flex-1 relative flex flex-col justify-center items-center p-6 bg-gradient-to-b from-slate-800 to-slate-950 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <MapPin size={300} className="text-slate-400" />
        </div>

        <div className="z-10 text-center space-y-6">
          {/* Quick Health/Mana Gauges */}
          <div className="flex gap-4 mb-8">
             <div className="w-24">
                <p className="text-[10px] font-bold text-green-500 uppercase mb-1">Health</p>
                <div className="h-2 w-full bg-slate-900 rounded-full border border-slate-700">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${(player.hp/player.maxHp)*100}%` }} />
                </div>
             </div>
             <div className="w-24">
                <p className="text-[10px] font-bold text-blue-500 uppercase mb-1">Mana</p>
                <div className="h-2 w-full bg-slate-900 rounded-full border border-slate-700">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(player.mp/player.maxMp)*100}%` }} />
                </div>
             </div>
          </div>

          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Town Center</h2>
          <p className="text-slate-400 max-w-xs text-sm font-medium">The monster threat grows outside the walls. Prepare yourself.</p>
        </div>
      </main>

            {/* 3. Landscape Command Deck (Buttons spread across the bottom) */}
      <footer className="flex-none bg-slate-900 border-t-2 border-slate-800 p-2 z-20">
        <div className="flex flex-row gap-2 h-16 max-w-full mx-auto">
          <Button 
            onClick={onStartBattle}
            className="flex-[2] h-full bg-red-600 border-b-4 border-red-900 font-black uppercase tracking-widest text-sm"
          >
            <Sword size={18} className="mr-2" /> Adventure
          </Button>
          <Button 
            onClick={onVisitShop}
            className="flex-1 h-full bg-slate-800 border-b-4 border-slate-950 font-bold text-amber-500 text-xs"
          >
            Shop
          </Button>
          <Button 
            onClick={onRest}
            className="flex-1 h-full bg-slate-800 border-b-4 border-slate-950 font-bold text-green-500 text-xs"
          >
            Rest
          </Button>
          <Button 
            onClick={() => setShowCharacter(true)}
            className="flex-1 h-full bg-slate-800 border-b-4 border-slate-950 font-bold text-blue-400 text-xs"
          >
            Stats
          </Button>
        </div>
      </footer>

      {/* Character Sheet Dialog - Fullscreen Mobile Style */}
      <Dialog open={showCharacter} onOpenChange={setShowCharacter}>
        <DialogContent className="bg-slate-900 border-slate-700 p-0 max-w-full h-[90dvh] flex flex-col">
          <DialogHeader className="p-4 border-b border-slate-800">
            <DialogTitle className="text-amber-500 font-black uppercase tracking-widest text-center">Hero Profile</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <CharacterSheet character={player} />
          </div>
          <div className="p-4 border-t border-slate-800">
            <Button onClick={() => setShowCharacter(false)} className="w-full bg-slate-800 text-white font-bold">Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
