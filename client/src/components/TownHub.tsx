import { motion } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { toast } from "sonner";

/**
 * =========================
 * TOWN HUB
 * =========================
 *
 * FIX BUG-05: All setScreen calls replaced with pushScene.
 * FIX BUG-06: pushScene imported from store (was out of scope).
 * ADDED: restAtInn wired to store (costs gold, restores HP/MP).
 * ADDED: Character sheet navigation.
 * ADDED: Map navigation (no longer "coming soon").
 * VISUAL: Styled grid layout, HP/MP/Gold bars, animated entrance.
 */

const CARD_VARIANTS = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.3, ease: "easeOut" },
  }),
};

export default function TownHub() {
  const player     = useGameStore((s) => s.player);
  const pushScene  = useGameStore((s) => s.pushScene);
  const restAtInn  = useGameStore((s) => s.restAtInn);

  const hpPct = Math.round((player.hp / player.maxHp) * 100);
  const mpPct = Math.round((player.mp / player.maxMp) * 100);
  const expPct = Math.round((player.exp / player.expToNextLevel) * 100);

  function handleRest() {
    const success = restAtInn();
    if (success) {
      toast.success("You rest at the inn. HP and MP fully restored!", {
        description: "Cost: 10 gold",
      });
    } else {
      toast.error("Not enough gold!", {
        description: "The inn costs 10 gold.",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col px-4 py-6 max-w-lg mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-5"
      >
        <h1 className="text-3xl font-bold text-amber-400 tracking-widest uppercase">
          🏘 Town Hub
        </h1>
        <p className="text-slate-500 text-xs mt-0.5 tracking-wider">
          Safe haven of the adventurer
        </p>
      </motion.div>

      {/* Player Status Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="bg-slate-900/70 border border-slate-700/50 rounded-2xl p-4 mb-5 shadow-xl"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-bold text-white text-lg leading-tight">{player.name}</p>
            <p className="text-xs text-slate-400">
              {player.class ?? "Adventurer"} · Lv {player.level}
            </p>
          </div>
          <div className="text-right">
            <p className="text-amber-400 font-bold text-sm">💰 {player.gold}</p>
            <p className="text-slate-500 text-xs">gold</p>
          </div>
        </div>

        {/* HP Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-red-400 font-medium">HP</span>
            <span className="text-slate-400">{player.hp} / {player.maxHp}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${hpPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={`h-full rounded-full transition-colors ${hpPct > 60 ? "bg-green-500" : hpPct > 30 ? "bg-yellow-500" : "bg-red-500"}`}
            />
          </div>
        </div>

        {/* MP Bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-blue-400 font-medium">MP</span>
            <span className="text-slate-400">{player.mp} / {player.maxMp}</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${mpPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              className="h-full rounded-full bg-blue-500"
            />
          </div>
        </div>

        {/* EXP Bar */}
        <div>
          <div className="flex justify-between text-xs mb-0.5">
            <span className="text-amber-400 font-medium">EXP</span>
            <span className="text-slate-400">{player.exp} / {player.expToNextLevel}</span>
          </div>
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${expPct}%` }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              className="h-full rounded-full bg-amber-500"
            />
          </div>
        </div>
      </motion.div>

      {/* Action Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          {
            icon: "⚔️",
            label: "Battle",
            sub: "Fight monsters",
            color: "from-red-900/60 border-red-700/40 hover:border-red-500/60",
            action: () => pushScene({ type: "battle" }),
            i: 0,
          },
          {
            icon: "🛒",
            label: "Shop",
            sub: "Buy gear",
            color: "from-amber-900/60 border-amber-700/40 hover:border-amber-500/60",
            action: () => pushScene({ type: "shop" }),
            i: 1,
          },
          {
            icon: "🗺️",
            label: "World Map",
            sub: "Explore regions",
            color: "from-green-900/60 border-green-700/40 hover:border-green-500/60",
            action: () => pushScene({ type: "map" }),
            i: 2,
          },
          {
            icon: "📜",
            label: "Character",
            sub: "Stats & inventory",
            color: "from-slate-800/60 border-slate-600/40 hover:border-slate-400/60",
            action: () => pushScene({ type: "character-sheet" }),
            i: 3,
          },
        ].map(({ icon, label, sub, color, action, i }) => (
          <motion.button
            key={label}
            custom={i}
            variants={CARD_VARIANTS}
            initial="hidden"
            animate="visible"
            whileTap={{ scale: 0.96 }}
            onClick={action}
            className={`
              p-4 rounded-xl border bg-gradient-to-b text-left transition-all duration-200
              ${color}
            `}
          >
            <div className="text-3xl mb-2">{icon}</div>
            <div className="font-bold text-white text-sm">{label}</div>
            <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
          </motion.button>
        ))}
      </div>

      {/* Inn / Rest */}
      <motion.button
        custom={4}
        variants={CARD_VARIANTS}
        initial="hidden"
        animate="visible"
        whileTap={{ scale: 0.97 }}
        onClick={handleRest}
        className="w-full p-4 rounded-xl border border-teal-700/40 bg-gradient-to-b from-teal-900/60 to-teal-800/20
          hover:border-teal-500/60 text-left transition-all duration-200 flex items-center gap-4"
      >
        <span className="text-3xl">🏨</span>
        <div>
          <div className="font-bold text-white text-sm">Rest at Inn</div>
          <div className="text-xs text-slate-400">Restore HP &amp; MP fully · 10 gold</div>
        </div>
        <div className="ml-auto text-amber-400 font-bold text-sm">10 💰</div>
      </motion.button>

      {/* Pet info strip */}
      {player.pet && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-4 p-3 rounded-xl border border-violet-800/30 bg-violet-950/20 flex items-center gap-3"
        >
          <span className="text-2xl">🐾</span>
          <div>
            <p className="text-xs font-bold text-violet-300">{player.pet.name}</p>
            <p className="text-xs text-slate-500">{player.pet.species} companion</p>
          </div>
          <div className="ml-auto text-xs text-slate-500">
            Lv {player.pet.level}
          </div>
        </motion.div>
      )}
    </div>
  );
}
