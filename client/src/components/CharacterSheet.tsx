import { motion } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { WEAPONS, ARMORS } from "../lib/gameData";

/**
 * =========================
 * CHARACTER SHEET
 * =========================
 *
 * FIX BUG-10: Was orphaned — now rendered by GameManager.
 * Shows all stats, equipment, pet, and progression.
 * Navigation via popScene.
 */

const STAT_ROWS = [
  { key: "str", label: "Strength",     icon: "⚔️",  color: "text-red-400"    },
  { key: "dex", label: "Dexterity",    icon: "🏹",  color: "text-green-400"  },
  { key: "int", label: "Intelligence", icon: "🔮",  color: "text-blue-400"   },
  { key: "end", label: "Endurance",    icon: "🛡️",  color: "text-orange-400" },
  { key: "cha", label: "Charisma",     icon: "✨",  color: "text-pink-400"   },
  { key: "luk", label: "Luck",         icon: "🍀",  color: "text-yellow-400" },
] as const;

export default function CharacterSheet() {
  const player    = useGameStore((s) => s.player);
  const inventory = useGameStore((s) => s.inventory);
  const popScene  = useGameStore((s) => s.popScene);

  const equippedWeapon = inventory.equippedWeaponId
    ? WEAPONS[inventory.equippedWeaponId]
    : null;

  const equippedArmor = inventory.equippedArmorId
    ? ARMORS[inventory.equippedArmorId]
    : null;

  const expPct = Math.round((player.exp / player.expToNextLevel) * 100);
  const hpPct  = Math.round((player.hp  / player.maxHp)  * 100);
  const mpPct  = Math.round((player.mp  / player.maxMp)  * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 max-w-lg mx-auto px-4 py-5 overflow-y-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={popScene}
          className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-amber-400 tracking-wider">📜 Character</h1>
        <div className="w-10" />
      </div>

      {/* Identity */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-5 mb-4 text-center"
      >
        <div className="text-5xl mb-2">🧙</div>
        <h2 className="text-white font-bold text-2xl">{player.name}</h2>
        <p className="text-slate-400 text-sm">
          {player.class ?? "Adventurer"} · Level {player.level}
        </p>

        {/* EXP */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>EXP</span>
            <span>{player.exp} / {player.expToNextLevel}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${expPct}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="h-full bg-amber-500 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-4 mb-4"
      >
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Resources</p>

        <ResourceBar label="HP" current={player.hp} max={player.maxHp} pct={hpPct}
          barColor={hpPct > 60 ? "bg-green-500" : hpPct > 30 ? "bg-yellow-500" : "bg-red-500"}
          labelColor="text-red-400" />
        <div className="mb-2" />
        <ResourceBar label="MP" current={player.mp} max={player.maxMp} pct={mpPct}
          barColor="bg-blue-500" labelColor="text-blue-400" />

        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-slate-400">Gold</span>
          <span className="text-amber-400 font-bold">💰 {player.gold}</span>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-4 mb-4"
      >
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Stats</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {STAT_ROWS.map(({ key, label, icon, color }) => {
            const val = player.stats[key];
            const pct = Math.min(100, (val / 25) * 100);
            return (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs">{icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className={`font-medium ${color}`}>{label}</span>
                    <span className="text-white font-bold">{val}</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={`h-full rounded-full ${color.replace("text-", "bg-")}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Equipment */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-4 mb-4"
      >
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Equipment</p>

        <EquipSlot
          icon="⚔️"
          slot="Weapon"
          name={equippedWeapon?.name ?? "None"}
          detail={equippedWeapon ? `+${equippedWeapon.effect.flatDamage} dmg` : "Bare hands"}
        />
        <div className="mt-2" />
        <EquipSlot
          icon="🛡️"
          slot="Armor"
          name={equippedArmor?.name ?? "None"}
          detail={equippedArmor
            ? `${Math.round((1 - equippedArmor.effect.damageTakenMultiplier) * 100)}% dmg reduction`
            : "No protection"}
        />
      </motion.div>

      {/* Pet */}
      {player.pet && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/70 border border-violet-800/30 rounded-2xl p-4 mb-4"
        >
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">🐾 Companion</p>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-900/40 flex items-center justify-center text-2xl border border-violet-700/40">
              🐉
            </div>
            <div>
              <p className="text-white font-bold">{player.pet.name}</p>
              <p className="text-xs text-slate-400">{player.pet.species} · Lv {player.pet.level}</p>
              <p className="text-xs text-violet-400 mt-0.5">
                Power: {player.pet.stats.power} · Agility: {player.pet.stats.agility}
              </p>
            </div>
          </div>

          {player.pet.abilities.length > 0 && (
            <div className="mt-3 flex flex-col gap-1.5">
              {player.pet.abilities.map((ab) => (
                <div key={ab.id} className="flex items-center gap-2 text-xs">
                  <span className="text-violet-400">✦</span>
                  <span className="text-slate-300 font-medium">{ab.name}</span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-500">{ab.description}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────

function ResourceBar({
  label, current, max, pct, barColor, labelColor,
}: {
  label: string; current: number; max: number; pct: number;
  barColor: string; labelColor: string;
}) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span className={`font-medium ${labelColor}`}>{label}</span>
        <span className="text-slate-400">{current} / {max}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
    </div>
  );
}

function EquipSlot({ icon, slot, name, detail }: {
  icon: string; slot: string; name: string; detail: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/30">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{slot}</p>
        <p className="text-white font-bold text-sm">{name}</p>
        <p className="text-xs text-slate-400">{detail}</p>
      </div>
    </div>
  );
}
