import { useState } from 'react';
import { Character } from '@/lib/gameEngine';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MapPin, Heart, Coins, Users } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-amber-100 drop-shadow-lg">BattleOn Town</h1>
        <p className="text-amber-200 mt-2">Welcome, {player.name}!</p>
      </div>

      {/* Player Status Bar */}
      <Card className="bg-amber-700 border-amber-600 border-2 p-4 mb-8 max-w-2xl mx-auto">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-amber-100 text-sm">Level</p>
            <p className="text-2xl font-bold text-amber-300">{player.level}</p>
          </div>
          <div>
            <p className="text-amber-100 text-sm">Health</p>
            <p className="text-2xl font-bold text-red-400">
              {player.hp}/{player.maxHp}
            </p>
          </div>
          <div>
            <p className="text-amber-100 text-sm">Mana</p>
            <p className="text-2xl font-bold text-blue-400">
              {player.mp}/{player.maxMp}
            </p>
          </div>
          <div>
            <p className="text-amber-100 text-sm">Gold</p>
            <p className="text-2xl font-bold text-yellow-500">{player.gold}</p>
          </div>
        </div>
      </Card>

      {/* Main Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
        {/* Inn */}
        <Card className="bg-amber-700 border-amber-600 border-2 p-6 hover:bg-amber-600 transition">
          <div className="flex items-center gap-3 mb-3">
            <Heart className="text-red-400" size={24} />
            <h2 className="text-2xl font-bold text-amber-100">The Inn</h2>
          </div>
          <p className="text-amber-200 mb-4">Rest and recover your health and mana.</p>
          <Button
            onClick={onRest}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Rest (Free)
          </Button>
        </Card>

        {/* Tavern */}
        <Card className="bg-amber-700 border-amber-600 border-2 p-6 hover:bg-amber-600 transition">
          <div className="flex items-center gap-3 mb-3">
            <Users className="text-purple-400" size={24} />
            <h2 className="text-2xl font-bold text-amber-100">The Tavern</h2>
          </div>
          <p className="text-amber-200 mb-4">Meet adventurers and hear tales of battles.</p>
          <Button
            onClick={onStartBattle}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            Find Battle
          </Button>
        </Card>

        {/* Shop */}
        <Card className="bg-amber-700 border-amber-600 border-2 p-6 hover:bg-amber-600 transition">
          <div className="flex items-center gap-3 mb-3">
            <Coins className="text-yellow-500" size={24} />
            <h2 className="text-2xl font-bold text-amber-100">The Shop</h2>
          </div>
          <p className="text-amber-200 mb-4">Buy weapons, armor, and potions.</p>
          <Button
            onClick={onVisitShop}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            Browse Shop
          </Button>
        </Card>

        {/* Character Sheet */}
        <Card className="bg-amber-700 border-amber-600 border-2 p-6 hover:bg-amber-600 transition">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="text-green-400" size={24} />
            <h2 className="text-2xl font-bold text-amber-100">Character</h2>
          </div>
          <p className="text-amber-200 mb-4">View your stats and equipment.</p>
          <Button
            onClick={() => setShowCharacter(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            View Stats
          </Button>
        </Card>
      </div>

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
