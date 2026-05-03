import { Character } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CharacterSheetProps {
  character: Character;
}

export default function CharacterSheet({ character }: CharacterSheetProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">

      <Tabs defaultValue="stats" className="w-full">

        {/* NAV */}
        <TabsList className="grid w-full grid-cols-3 bg-slate-700 border-2 border-amber-600">
          <TabsTrigger value="stats" className="text-amber-400 data-[state=active]:bg-amber-600">
            Stats
          </TabsTrigger>
          <TabsTrigger value="equipment" className="text-amber-400 data-[state=active]:bg-amber-600">
            Equipment
          </TabsTrigger>
          <TabsTrigger value="inventory" className="text-amber-400 data-[state=active]:bg-amber-600">
            Inventory
          </TabsTrigger>
        </TabsList>

        {/* ===================== */}
        {/* STATS TAB */}
        {/* ===================== */}
        <TabsContent value="stats">
          <Card className="bg-slate-700 border-amber-600 border-2 p-6">

            <h3 className="text-xl font-bold text-amber-400 mb-4">
              {character.name}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-6">

              <div className="bg-slate-600 p-3 rounded">
                <p className="text-slate-300 text-sm">Level</p>
                <p className="text-2xl font-bold text-amber-400">
                  {character.level}
                </p>
              </div>

              <div className="bg-slate-600 p-3 rounded">
                <p className="text-slate-300 text-sm">Experience</p>
                <p className="text-2xl font-bold text-amber-400">
                  {character.exp}
                </p>
              </div>

              <div className="bg-slate-600 p-3 rounded">
                <p className="text-slate-300 text-sm">Gold</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {character.gold}
                </p>
              </div>

              <div className="bg-slate-600 p-3 rounded">
                <p className="text-slate-300 text-sm">Health</p>
                <p className="text-2xl font-bold text-red-400">
                  {character.hp}/{character.maxHp}
                </p>
              </div>

            </div>

            {/* CORE STATS */}
            <div className="space-y-3">

              <h4 className="text-amber-400 font-bold">
                Core Stats
              </h4>

              <div className="grid grid-cols-3 gap-3">

                {[
                  ["STR", "red-400"],
                  ["DEX", "green-400"],
                  ["INT", "blue-400"],
                  ["END", "orange-400"],
                  ["CHA", "purple-400"],
                  ["LUK", "yellow-400"],
                ].map(([key, color]) => (
                  <div key={key} className="bg-slate-600 p-3 rounded text-center">
                    <p className="text-slate-300 text-xs">{key}</p>
                    <p className={`text-xl font-bold text-${color}`}>
                      {character.stats[key.toLowerCase() as keyof typeof character.stats]}
                    </p>
                  </div>
                ))}

              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ===================== */}
        {/* EQUIPMENT TAB */}
        {/* ===================== */}
        <TabsContent value="equipment">
          <Card className="bg-slate-700 border-amber-600 border-2 p-6">

            <h3 className="text-xl font-bold text-amber-400 mb-4">
              Equipment
            </h3>

            <div className="space-y-3">

              <div className="bg-slate-600 p-4 rounded">
                <p className="text-slate-300 text-sm">Weapon</p>
                <p className="text-lg font-bold text-amber-300">
                  {character.equipment.weapon || "None"}
                </p>
              </div>

              <div className="bg-slate-600 p-4 rounded">
                <p className="text-slate-300 text-sm">Armor</p>
                <p className="text-lg font-bold text-amber-300">
                  {character.equipment.armor || "None"}
                </p>
              </div>

              <div className="bg-slate-600 p-4 rounded">
                <p className="text-slate-300 text-sm">Shield</p>
                <p className="text-lg font-bold text-amber-300">
                  {character.equipment.shield || "None"}
                </p>
              </div>

            </div>

          </Card>
        </TabsContent>

        {/* ===================== */}
        {/* INVENTORY TAB */}
        {/* ===================== */}
        <TabsContent value="inventory">
          <Card className="bg-slate-700 border-amber-600 border-2 p-6">

            <h3 className="text-xl font-bold text-amber-400 mb-4">
              Inventory
            </h3>

            <div className="space-y-2">

              {(character.items ?? []).length > 0 ? (
                character.items.map((item) => (
                  <div key={item.id} className="bg-slate-600 p-3 rounded flex justify-between">

                    <div>
                      <p className="font-bold text-amber-300">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.effect}
                      </p>
                    </div>

                    <p className="text-amber-400 font-bold">
                      x{item.quantity}
                    </p>

                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-center py-4">
                  No items
                </p>
              )}

            </div>

            {/* SPELLS */}
            <div className="mt-6">

              <h4 className="text-amber-400 font-bold mb-3">
                Spells
              </h4>

              <div className="space-y-2">

                {(character.spells ?? []).map((spell) => (
                  <div key={spell.id} className="bg-slate-600 p-3 rounded">

                    <div className="flex justify-between items-start">

                      <div>
                        <p className="font-bold text-blue-300">
                          {spell.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {spell.description}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-300">
                          Cost: {spell.cost} MP
                        </p>
                        <p className="text-xs text-slate-300">
                          Dmg: {spell.damage}
                        </p>
                      </div>

                    </div>

                  </div>
                ))}

              </div>
            </div>

          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}