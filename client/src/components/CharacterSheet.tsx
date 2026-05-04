import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createDefaultPlayer } from "@/lib/characterFactory";

type Character = ReturnType<typeof createDefaultPlayer> & {
  equipment?: {
    weapon?: string;
    armor?: string;
    shield?: string;
  };
  items?: Array<{
    id: string;
    name: string;
    effect: string;
    quantity: number;
  }>;
  spells?: Array<{
    id: string;
    name: string;
    description: string;
    cost: number;
    damage: number;
  }>;
};

interface CharacterSheetProps {
  character: Character;
}

const STAT_KEYS = [
  "str",
  "dex",
  "int",
  "end",
  "cha",
  "luk",
] as const;

export default function CharacterSheet({ character }: CharacterSheetProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">

      <Tabs defaultValue="stats" className="w-full">

        {/* NAV */}
        <TabsList className="grid w-full grid-cols-3 bg-slate-700 border-2 border-amber-600">
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="equipment">Equipment</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>

        {/* ================= STATS ================= */}
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

                {STAT_KEYS.map((key) => (
                  <div key={key} className="bg-slate-600 p-3 rounded text-center">

                    <p className="text-slate-300 text-xs uppercase">
                      {key}
                    </p>

                    <p className="text-xl font-bold text-amber-300">
                      {character.stats[key]}
                    </p>

                  </div>
                ))}

              </div>
            </div>

          </Card>
        </TabsContent>

        {/* ================= EQUIPMENT ================= */}
        <TabsContent value="equipment">
          <Card className="bg-slate-700 border-amber-600 border-2 p-6">

            <h3 className="text-xl font-bold text-amber-400 mb-4">
              Equipment
            </h3>

            <div className="space-y-3">

              <div className="bg-slate-600 p-4 rounded">
                Weapon: {character.equipment?.weapon ?? "None"}
              </div>

              <div className="bg-slate-600 p-4 rounded">
                Armor: {character.equipment?.armor ?? "None"}
              </div>

              <div className="bg-slate-600 p-4 rounded">
                Shield: {character.equipment?.shield ?? "None"}
              </div>

            </div>

          </Card>
        </TabsContent>

        {/* ================= INVENTORY ================= */}
        <TabsContent value="inventory">
          <Card className="bg-slate-700 border-amber-600 border-2 p-6">

            <h3 className="text-xl font-bold text-amber-400 mb-4">
              Inventory
            </h3>

            {(character.items?.length ?? 0) > 0 ? (
              character.items!.map((item) => (
                <div key={item.id} className="bg-slate-600 p-3 rounded flex justify-between mb-2">

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

            {/* SPELLS */}
            <div className="mt-6">

              <h4 className="text-amber-400 font-bold mb-3">
                Spells
              </h4>

              {(character.spells ?? []).map((spell) => (
                <div key={spell.id} className="bg-slate-600 p-3 rounded mb-2">

                  <p className="font-bold text-blue-300">
                    {spell.name}
                  </p>

                  <p className="text-xs text-slate-400">
                    {spell.description}
                  </p>

                </div>
              ))}

            </div>

          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}