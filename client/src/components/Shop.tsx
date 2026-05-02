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

export default function Shop({ player, weapons, armors, onPurchaseWeapon, onPurchaseArmor }: ShopProps) {
  const [selectedTab, setSelectedTab] = useState('weapons');

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900 p-4">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-amber-100 drop-shadow-lg">Merchant's Shop</h1>
        <p className="text-amber-200 mt-2">Upgrade your equipment</p>
      </div>

      {/* Player Gold Display */}
      <Card className="bg-amber-700 border-amber-600 border-2 p-4 mb-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-amber-100 text-sm">Your Gold</p>
            <p className="text-3xl font-bold text-yellow-500">{player.gold}</p>
          </div>
          <Coins className="text-yellow-500" size={48} />
        </div>
      </Card>

      {/* Shop Tabs */}
      <div className="max-w-4xl mx-auto">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-amber-700 border-2 border-amber-600">
            <TabsTrigger value="weapons" className="text-amber-100 data-[state=active]:bg-amber-600">
              Weapons
            </TabsTrigger>
            <TabsTrigger value="armor" className="text-amber-100 data-[state=active]:bg-amber-600">
              Armor
            </TabsTrigger>
          </TabsList>

          {/* Weapons Tab */}
          <TabsContent value="weapons" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weapons.map((weapon) => {
                const canAfford = player.gold >= weapon.price;
                const isEquipped = player.equipment.weapon === weapon.id;

                return (
                  <Card
                    key={weapon.id}
                    className={`p-4 border-2 ${
                      isEquipped
                        ? 'bg-green-700 border-green-500'
                        : 'bg-amber-700 border-amber-600'
                    }`}
                  >
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-amber-100">{weapon.name}</h3>
                      <p className="text-sm text-amber-200">
                        Type: <span className="capitalize">{weapon.type}</span>
                      </p>
                      <p className="text-sm text-amber-200">
                        Element: <span className="capitalize text-amber-300">{weapon.element}</span>
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-amber-100">Damage:</span>
                        <span className="text-red-400 font-bold">{weapon.damage}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-amber-100">Accuracy:</span>
                        <span className="text-blue-400 font-bold">{weapon.accuracy}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-amber-100">Level Req:</span>
                        <span className="text-purple-400 font-bold">{weapon.level}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-amber-600 pt-2">
                        <span className="text-amber-100">Price:</span>
                        <span className="text-yellow-500 font-bold">{weapon.price} Gold</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => onPurchaseWeapon(weapon.id)}
                      disabled={!canAfford || isEquipped}
                      className={`w-full font-bold ${
                        isEquipped
                          ? 'bg-green-600 text-white'
                          : canAfford
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {isEquipped ? '✓ Equipped' : canAfford ? 'Buy' : 'Not Enough Gold'}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Armor Tab */}
          <TabsContent value="armor" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {armors.map((armor) => {
                const canAfford = player.gold >= armor.price;
                const isEquipped = player.equipment.armor === armor.id;

                return (
                  <Card
                    key={armor.id}
                    className={`p-4 border-2 ${
                      isEquipped
                        ? 'bg-green-700 border-green-500'
                        : 'bg-amber-700 border-amber-600'
                    }`}
                  >
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-amber-100">{armor.name}</h3>
                      <p className="text-sm text-amber-200">Protective Gear</p>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-amber-100">Defense:</span>
                        <span className="text-blue-400 font-bold">{armor.defense}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-amber-100">Level Req:</span>
                        <span className="text-purple-400 font-bold">{armor.level}</span>
                      </div>
                      <div className="flex justify-between text-sm border-t border-amber-600 pt-2">
                        <span className="text-amber-100">Price:</span>
                        <span className="text-yellow-500 font-bold">{armor.price} Gold</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => onPurchaseArmor(armor.id)}
                      disabled={!canAfford || isEquipped}
                      className={`w-full font-bold ${
                        isEquipped
                          ? 'bg-green-600 text-white'
                          : canAfford
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}
                    >
                      {isEquipped ? '✓ Equipped' : canAfford ? 'Buy' : 'Not Enough Gold'}
                    </Button>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto mt-8">
        <Button variant="outline" className="w-full text-amber-400 border-amber-600">
          ← Back to Town
        </Button>
      </div>
    </div>
  );
}
