import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { WEAPONS, ARMORS } from "../lib/gameData";
import { toast } from "sonner";

/**
 * =========================
 * SHOP
 * =========================
 *
 * FIX BUG-05: setScreen replaced with popScene.
 * FIX BUG-11: Real purchase logic — deducts gold, adds to inventory,
 *             calls equipWeapon/equipArmor automatically.
 * FIX BUG-11: isWeapon check was broken (`"damage" in item` — wrong field).
 *             Now uses separate WEAPONS/ARMORS catalogs with tab switching.
 *
 * ADDED: Tab navigation (Weapons / Armor).
 * ADDED: Owned / equipped badge per item.
 * ADDED: Level requirement display.
 * ADDED: Confirm toast on purchase.
 */

type Tab = "weapons" | "armor";

export default function Shop() {
  const player          = useGameStore((s) => s.player);
  const inventory       = useGameStore((s) => s.inventory);
  const purchaseWeapon  = useGameStore((s) => s.purchaseWeapon);
  const purchaseArmor   = useGameStore((s) => s.purchaseArmor);
  const equipWeapon     = useGameStore((s) => s.equipWeapon);
  const equipArmor      = useGameStore((s) => s.equipArmor);
  const popScene        = useGameStore((s) => s.popScene);

  const [tab, setTab] = useState<Tab>("weapons");

  function handleBuyWeapon(id: string) {
    const result = purchaseWeapon(id);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  function handleBuyArmor(id: string) {
    const result = purchaseArmor(id);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  }

  const weaponEntries = Object.values(WEAPONS);
  const armorEntries  = Object.values(ARMORS);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col max-w-lg mx-auto px-4 py-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={popScene}
          className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-amber-400 tracking-wider">🛒 Shop</h1>
        <div className="text-sm text-amber-400 font-bold">💰 {player.gold}</div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900/60 border border-slate-800 rounded-xl p-1 mb-4 gap-1">
        {(["weapons", "armor"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 capitalize ${
              tab === t
                ? "bg-amber-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {t === "weapons" ? "⚔ Weapons" : "🛡 Armor"}
          </button>
        ))}
      </div>

      {/* Items */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, x: tab === "weapons" ? -10 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-3"
        >
          {tab === "weapons" && weaponEntries.map((weapon) => {
            const owned    = inventory.weaponIds.includes(weapon.id);
            const equipped = inventory.equippedWeaponId === weapon.id;
            const canAfford = player.gold >= weapon.price;
            const meetsLevel = player.level >= weapon.level;

            return (
              <ShopItemCard
                key={weapon.id}
                icon="⚔️"
                name={weapon.name}
                price={weapon.price}
                levelReq={weapon.level}
                detail={`+${weapon.effect.flatDamage} dmg · ${weapon.type}`}
                owned={owned}
                equipped={equipped}
                canAfford={canAfford}
                meetsLevel={meetsLevel}
                onBuy={() => handleBuyWeapon(weapon.id)}
                onEquip={() => equipWeapon(weapon.id)}
              />
            );
          })}

          {tab === "armor" && armorEntries.map((armor) => {
            const owned    = inventory.armorIds.includes(armor.id);
            const equipped = inventory.equippedArmorId === armor.id;
            const canAfford = player.gold >= armor.price;
            const meetsLevel = player.level >= armor.level;
            const reductionPct = Math.round((1 - armor.effect.damageTakenMultiplier) * 100);

            return (
              <ShopItemCard
                key={armor.id}
                icon="🛡️"
                name={armor.name}
                price={armor.price}
                levelReq={armor.level}
                detail={`${reductionPct}% dmg reduction`}
                owned={owned}
                equipped={equipped}
                canAfford={canAfford}
                meetsLevel={meetsLevel}
                onBuy={() => handleBuyArmor(armor.id)}
                onEquip={() => equipArmor(armor.id)}
              />
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ─── ITEM CARD ───────────────────────────────────────────────

function ShopItemCard({
  icon, name, price, levelReq, detail,
  owned, equipped, canAfford, meetsLevel,
  onBuy, onEquip,
}: {
  icon: string;
  name: string;
  price: number;
  levelReq: number;
  detail: string;
  owned: boolean;
  equipped: boolean;
  canAfford: boolean;
  meetsLevel: boolean;
  onBuy: () => void;
  onEquip: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        p-4 rounded-xl border bg-slate-900/60 flex items-center gap-3
        ${equipped
          ? "border-amber-600/50 shadow shadow-amber-900/20"
          : "border-slate-800/50"}
      `}
    >
      <span className="text-2xl">{icon}</span>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-bold text-white text-sm">{name}</p>
          {equipped && (
            <span className="text-[10px] bg-amber-500/20 border border-amber-500/40 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">
              EQUIPPED
            </span>
          )}
          {owned && !equipped && (
            <span className="text-[10px] bg-slate-700/50 border border-slate-600 text-slate-400 px-1.5 py-0.5 rounded-full">
              OWNED
            </span>
          )}
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{detail}</p>
        <p className="text-xs text-slate-600 mt-0.5">Req. Lv {levelReq}</p>
      </div>

      <div className="flex flex-col gap-1.5 items-end shrink-0">
        {owned ? (
          <button
            onClick={onEquip}
            disabled={equipped}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              equipped
                ? "bg-slate-800 text-slate-600 cursor-default"
                : "bg-slate-700 hover:bg-slate-600 text-white"
            }`}
          >
            {equipped ? "✓ On" : "Equip"}
          </button>
        ) : (
          <button
            onClick={onBuy}
            disabled={!canAfford || !meetsLevel}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !canAfford || !meetsLevel
                ? "bg-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950"
            }`}
          >
            {!meetsLevel ? `Lv ${levelReq}` : `${price} 💰`}
          </button>
        )}
      </div>
    </motion.div>
  );
}
