import { useState } from 'react';
import { Character, Weapon, Armor } from '@/lib/gameEngine';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Coins, ArrowLeft, ShieldCheck, Sword } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShopProps {
  player: Character;
  weapons: Weapon[];
  armors: Armor[];
  onPurchaseWeapon: (weaponId: string) => void;
  onPurchaseArmor: (armorId: string) => void;
  onBack: () => void;
}

export default function Shop({ player, weapons, armors, onPurchaseWeapon, onPurchaseArmor, onBack }: ShopProps) {
  const [selectedTab, setSelectedTab] = useState<'weapons' | 'armor'>('weapons');

  return (
    <div className="h-full w-full flex flex-row overflow-hidden bg-slate-950 font-sans select-none p-2 gap-2">
      
      {/* 1. LEFT PANEL: Shop Navigation (Thumb Zone) */}
      <aside className="w-1/4 flex flex-col gap-2 z-20">
        <Card className="flex-none bg-slate-900 border-2 border-amber-600/50 p-3 shadow-xl">
          <h1 className="text-sm font-black text-amber-500 uppercase tracking-tighter mb-1">Blacksmith</h1>
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
            <Coins size={16} className="text-yellow-500" />
            <span className="text-lg font-black text-yellow-500 leading-none">{player.gold}</span>
          </div>
        </Card>

        <nav className="flex-1 flex flex-col gap-2">
          <Button 
            variant="retro"
            onClick={() => setSelectedTab('weapons')}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1",
              selectedTab === 'weapons' ? "bg-amber-600 text-white border-amber-400" : "bg-slate-800 text-slate-400 border-slate-950"
            )}
          >
            <Sword size={24} />
            <span className="font-black text-[10px]">WEAPONS</span>
          </Button>

          <Button 
            variant="retro"
            onClick={() => setSelectedTab('armor')}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1",
              selectedTab === 'armor' ? "bg-amber-600 text-white border-amber-400" : "bg-slate-800 text-slate-400 border-slate-950"
            )}
          >
            <ShieldCheck size={24} />
            <span className="font-black text-[10px]">ARMOR</span>
          </Button>

          <Button 
            variant="retro"
            onClick={onBack}
            className="h-16 bg-slate-900 text-red-400 border-red-900/50 hover:bg-red-900/20"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span className="font-bold text-[10px]">LEAVE</span>
          </Button>
        </nav>
      </aside>

      {/* 2. RIGHT PANEL: Scrollable Inventory */}
      <main className="flex-1 bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
        <header className="p-3 bg-slate-900/80 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest">
            Available {selectedTab}
          </h2>
          <p className="text-[10px] text-slate-500 font-bold italic">Restocking at Level {player.level + 1}</p>
        </header>

        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar space-y-3">
          {(selectedTab === 'weapons' ? weapons : armors).map((item) => {
            const isWeapon = 'damage' in item;
            const canAfford = player.gold >= item.price;
            const isEquipped = isWeapon 
              ? player.equipment.weapon === item.id 
              : player.equipment.armor === item.id;
            const levelLocked = player.level < item.level;

            return (
              <Card key={item.id} className={cn(
                "p-0 overflow-hidden border-2 transition-all",
                isEquipped ? 'bg-green-900/20 border-green-500/50 shadow-inner' : 'bg-slate-800 border-slate-700'
              )}>
                <div className="flex">
                  {/* Icon Area */}
                  <div className="w-16 bg-slate-950/50 flex items-center justify-center border-r border-slate-700/50">
                    <ShoppingCart className={cn("size-6", isEquipped ? "text-green-500" : "text-slate-600")} />
                  </div>

                  {/* Details Area */}
                  <div className="flex-1 p-3">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={cn("font-black text-sm uppercase", isEquipped ? 'text-green-400' : 'text-amber-100')}>
                        {item.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500 font-black text-sm tracking-tighter">{item.price}G</span>
                      </div>
                    </div>

                    <div className="flex gap-4 text-[9px] font-black uppercase tracking-wider text-slate-500 mb-3">
                      {isWeapon ? (
                        <>
                          <span>ATK: <b className="text-red-500">{(item as Weapon).damage}</b></span>
                          <span>ACC: <b className="text-blue-400">{(item as Weapon).accuracy}%</b></span>
                        </>
                      ) : (
                        <span>DEF: <b className="text-blue-500">{(item as Armor).defense}</b></span>
                      )}
                      <span className={cn(levelLocked ? "text-purple-500" : "text-slate-400")}>REQ: LVL {item.level}</span>
                    </div>

                    <Button
                      variant="retro"
                      onClick={() => isWeapon ? onPurchaseWeapon(item.id) : onPurchaseArmor(item.id)}
                      disabled={!canAfford || isEquipped || levelLocked}
                      className={cn(
                        "w-full h-10 font-black uppercase text-[10px]",
                        isEquipped ? 'bg-green-600 border-green-800 text-white' : 
                        levelLocked ? 'bg-slate-800 border-slate-950 opacity-40' :
                        canAfford ? 'bg-amber-600 border-amber-800 text-white' : 'bg-red-950 border-red-900 text-red-200'
                      )}
                    >
                      {isEquipped ? '✓ EQUIPPED' : levelLocked ? 'LEVEL LOCKED' : canAfford ? 'PURCHASE & EQUIP' : 'NOT ENOUGH GOLD'}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
