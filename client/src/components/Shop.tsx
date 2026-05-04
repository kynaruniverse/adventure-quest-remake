import { useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { WEAPONS, ARMORS } from "@/lib/gameData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ShoppingCart,
  Coins,
  ArrowLeft,
  ShieldCheck,
  Sword,
} from "lucide-react";
import { cn } from "@/lib/cn";

export default function Shop() {
  const player = useGameStore((s) => s.player);
  const setScreen = useGameStore((s) => s.setScreen);

  const weapons = Object.values(WEAPONS);
  const armors = Object.values(ARMORS);

  const [selectedTab, setSelectedTab] = useState<
    "weapons" | "armor"
  >("weapons");

  const onBack = () => setScreen("town");

  // TEMP HANDLERS (replace later with real inventory system)
  const onPurchaseWeapon = (id: string) => {
    console.log("Buy weapon:", id);
  };

  const onPurchaseArmor = (id: string) => {
    console.log("Buy armor:", id);
  };

  return (
    <div className="h-full w-full flex flex-row overflow-hidden bg-slate-950 font-sans select-none p-2 gap-2">
      
      {/* LEFT PANEL */}
      <aside className="w-1/4 flex flex-col gap-2 z-20">
        <Card className="flex-none bg-slate-900 border-2 border-amber-600/50 p-3 shadow-xl">
          <h1 className="text-sm font-black text-amber-500 uppercase tracking-tighter mb-1">
            Blacksmith
          </h1>

          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded border border-slate-800">
            <Coins size={16} className="text-yellow-500" />
            <span className="text-lg font-black text-yellow-500 leading-none">
              {player.gold}
            </span>
          </div>
        </Card>

        <nav className="flex-1 flex flex-col gap-2">
          <Button
            variant="retro"
            onClick={() => setSelectedTab("weapons")}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1",
              selectedTab === "weapons"
                ? "bg-amber-600 text-white border-amber-400"
                : "bg-slate-800 text-slate-400 border-slate-950"
            )}
          >
            <Sword size={24} />
            <span className="font-black text-[10px]">
              WEAPONS
            </span>
          </Button>

          <Button
            variant="retro"
            onClick={() => setSelectedTab("armor")}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1",
              selectedTab === "armor"
                ? "bg-amber-600 text-white border-amber-400"
                : "bg-slate-800 text-slate-400 border-slate-950"
            )}
          >
            <ShieldCheck size={24} />
            <span className="font-black text-[10px]">
              ARMOR
            </span>
          </Button>

          <Button
            variant="retro"
            onClick={onBack}
            className="h-16 bg-slate-900 text-red-400 border-red-900/50 hover:bg-red-900/20"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span className="font-bold text-[10px]">
              LEAVE
            </span>
          </Button>
        </nav>
      </aside>

      {/* RIGHT PANEL */}
      <main className="flex-1 bg-slate-900/40 rounded-xl border border-slate-800 overflow-hidden flex flex-col">
        <header className="p-3 bg-slate-900/80 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xs font-black text-slate-300 uppercase tracking-widest">
            Available {selectedTab}
          </h2>

          <p className="text-[10px] text-slate-500 font-bold italic">
            Restocking at Level {player.level + 1}
          </p>
        </header>

        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {(selectedTab === "weapons"
            ? weapons
            : armors
          ).map((item) => {
            const isWeapon = "damage" in item;
            const canAfford = player.gold >= item.price;

            const levelLocked = player.level < item.level;

            return (
              <Card
                key={item.id}
                className="p-0 overflow-hidden border-2 bg-slate-800 border-slate-700"
              >
                <div className="flex">
                  <div className="w-16 bg-slate-950/50 flex items-center justify-center border-r border-slate-700/50">
                    <ShoppingCart className="size-6 text-slate-600" />
                  </div>

                  <div className="flex-1 p-3">
                    <h3 className="font-black text-sm uppercase">
                      {item.name}
                    </h3>

                    <Button
                      onClick={() =>
                        isWeapon
                          ? onPurchaseWeapon(item.id)
                          : onPurchaseArmor(item.id)
                      }
                      disabled={!canAfford || levelLocked}
                      className="w-full mt-2"
                    >
                      Buy
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