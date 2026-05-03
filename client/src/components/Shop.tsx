import { useState } from 'react';
import { Character, Weapon, Armor } from '@/lib/gameEngine';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Coins } from 'lucide-react';

interface ShopProps {
  player: Character;
  weapons: Weapon[];
  armors: Armor[];
  onPurchaseWeapon: (weaponId: string) => void;
  onPurchaseArmor: (armorId: string) => void;
}

export default function Shop({ player, weapons, armors, onPurchaseWeapon, onPurchaseArmor, onBack }: ShopProps & { onBack: () => void }) {
  const [selectedTab, setSelectedTab] = useState('weapons');

    return (
    <div className="h-[100dvh] w-full flex flex-col overflow-hidden bg-slate-950 select-none">
      
      {/* HUD / Header */}
      <header className="flex-none p-4 bg-slate-900 border-b-2 border-amber-600/50 flex justify-between items-center z-10 shadow-lg">
        <div>
          <h1 className="text-xl font-black text-amber-500 uppercase tracking-tighter">Blacksmith</h1>
          <div className="flex items-center gap-1">
            <Coins size={14} className="text-yellow-500" />
            <span className="text-lg font-bold text-yellow-500">{player.gold}</span>
          </div>
        </div>
        <Button 
          onClick={onBack}
          variant="ghost" 
          className="text-amber-500 border border-amber-900/50 hover:bg-amber-900/20"
        >
          Leave Shop
        </Button>
      </header>

      {/* Main Shop Area */}
      <main className="flex-1 overflow-y-auto p-4 bg-slate-900/50 custom-scrollbar">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-2 border-slate-700 mb-4 p-1 h-12">
            <TabsTrigger value="weapons" className="font-bold data-[state=active]:bg-amber-600 data-[state=active]:text-slate-950">
              WEAPONS
            </TabsTrigger>
            <TabsTrigger value="armor" className="font-bold data-[state=active]:bg-amber-600 data-[state=active]:text-slate-950">
              ARMOR
            </TabsTrigger>
          </TabsList>

          {/* Weapons Content */}
          <TabsContent value="weapons" className="space-y-3 m-0 outline-none">
            {weapons.map((weapon) => {
              const canAfford = player.gold >= weapon.price;
              const isEquipped = player.equipment.weapon === weapon.id;
              const levelLocked = player.level < weapon.level;

              return (
                <Card key={weapon.id} className={`p-0 overflow-hidden border-2 bg-slate-800 ${isEquipped ? 'border-green-500' : 'border-slate-700'}`}>
                  <div className="flex">
                    <div className="w-20 bg-slate-700 flex items-center justify-center border-r border-slate-600">
                      <ShoppingCart className={isEquipped ? "text-green-500" : "text-slate-500"} size={32} />
                    </div>
                    <div className="flex-1 p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold ${isEquipped ? 'text-green-400' : 'text-amber-100'}`}>{weapon.name}</h3>
                        <span className="text-yellow-500 font-black tracking-tighter">{weapon.price}G</span>
                      </div>
                      <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                        <span>ATK: <b className="text-red-400">{weapon.damage}</b></span>
                        <span>ACC: <b className="text-blue-400">{weapon.accuracy}%</b></span>
                        <span className={levelLocked ? "text-purple-500" : ""}>LVL: {weapon.level}</span>
                      </div>
                      <Button
                        onClick={() => onPurchaseWeapon(weapon.id)}
                        disabled={!canAfford || isEquipped || levelLocked}
                        size="sm"
                        className={`w-full h-8 font-black uppercase text-xs rounded-none border-b-2 ${
                          isEquipped ? 'bg-green-600 border-green-800' : 
                          levelLocked ? 'bg-slate-700 border-slate-900 opacity-50' :
                          canAfford ? 'bg-amber-500 border-amber-700 text-slate-900' : 'bg-red-900/50 border-red-950 text-red-200'
                        }`}
                      >
                        {isEquipped ? 'Equipped' : levelLocked ? `Level ${weapon.level} Required` : canAfford ? 'Purchase' : 'Low Gold'}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>

          {/* Armor Content */}
          <TabsContent value="armor" className="space-y-3 m-0 outline-none">
            {armors.map((armor) => {
              const canAfford = player.gold >= armor.price;
              const isEquipped = player.equipment.armor === armor.id;
              const levelLocked = player.level < armor.level;

              return (
                <Card key={armor.id} className={`p-0 overflow-hidden border-2 bg-slate-800 ${isEquipped ? 'border-green-500' : 'border-slate-700'}`}>
                  <div className="flex">
                    <div className="w-20 bg-slate-700 flex items-center justify-center border-r border-slate-600">
                      <ShoppingCart className={isEquipped ? "text-green-500" : "text-slate-500"} size={32} />
                    </div>
                    <div className="flex-1 p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className={`font-bold ${isEquipped ? 'text-green-400' : 'text-amber-100'}`}>{armor.name}</h3>
                        <span className="text-yellow-500 font-black tracking-tighter">{armor.price}G</span>
                      </div>
                      <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                        <span>DEF: <b className="text-blue-400">{armor.defense}</b></span>
                        <span className={levelLocked ? "text-purple-500" : ""}>LVL: {armor.level}</span>
                      </div>
                      <Button
                        onClick={() => onPurchaseArmor(armor.id)}
                        disabled={!canAfford || isEquipped || levelLocked}
                        size="sm"
                        className={`w-full h-8 font-black uppercase text-xs rounded-none border-b-2 ${
                          isEquipped ? 'bg-green-600 border-green-800' : 
                          levelLocked ? 'bg-slate-700 border-slate-900 opacity-50' :
                          canAfford ? 'bg-amber-500 border-amber-700 text-slate-900' : 'bg-red-900/50 border-red-950 text-red-200'
                        }`}
                      >
                        {isEquipped ? 'Equipped' : levelLocked ? `Level ${armor.level} Required` : canAfford ? 'Purchase' : 'Low Gold'}
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Hint Footer */}
      <footer className="flex-none p-3 bg-slate-950 text-center border-t border-slate-800">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">New stock arrives as you level up</p>
      </footer>
    </div>
  );
}
