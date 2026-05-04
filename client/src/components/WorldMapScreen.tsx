import { useEffect } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { createStarterRegion } from "../lib/worldGenerator";

/**
 * =========================
 * WORLD MAP SCREEN
 * =========================
 *
 * FIX ISSUE-17: World map was fully implemented but unreachable.
 * This screen was missing — now wired via GameManager "map" scene.
 *
 * - Loads starter region if none exists.
 * - Renders nodes as unlocked / locked / completed.
 * - Tapping an unlocked node starts a battle at the appropriate level.
 */

export default function WorldMapScreen() {
  const region       = useGameStore((s) => s.region);
  const currentNodeId = useGameStore((s) => s.currentNodeId);
  const setRegion    = useGameStore((s) => s.setRegion);
  const setNode      = useGameStore((s) => s.setNode);
  const startBattle  = useGameStore((s) => s.startBattle);
  const popScene     = useGameStore((s) => s.popScene);
  const player       = useGameStore((s) => s.player);

  // Initialise the starter region the first time this screen mounts
  useEffect(() => {
    if (!region) {
      setRegion(createStarterRegion());
    }
  }, [region, setRegion]);

  function handleNodePress(nodeId: string, nodeLevel: number) {
    setNode(nodeId);
    startBattle(nodeLevel, 1);
  }

  if (!region) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-slate-500 text-sm">Loading map…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 max-w-lg mx-auto px-4 py-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={popScene}
          className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-amber-400 tracking-wider">🗺 {region.name}</h1>
        <div className="text-xs text-slate-500">Lv {player.level}</div>
      </div>

      <p className="text-slate-400 text-sm text-center mb-6">{region.description}</p>

      {/* Node grid */}
      <div className="grid grid-cols-3 gap-3">
        {region.nodes.map((node, i) => {
          const isCompleted = node.completed;
          const isUnlocked  = node.unlocked;
          const isCurrent   = node.id === currentNodeId;

          return (
            <motion.button
              key={node.id}
              custom={i}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileTap={{ scale: 0.95 }}
              disabled={!isUnlocked}
              onClick={() => handleNodePress(node.id, node.level ?? player.level)}
              className={`
                relative p-3 rounded-xl border text-center transition-all duration-200
                ${isCompleted
                  ? "border-green-700/50 bg-green-950/40"
                  : isUnlocked
                  ? "border-amber-700/50 bg-amber-950/30 hover:border-amber-500/70"
                  : "border-slate-800/50 bg-slate-900/30 opacity-40 cursor-not-allowed"}
                ${isCurrent ? "ring-2 ring-amber-400/60" : ""}
              `}
            >
              <div className="text-2xl mb-1">
                {isCompleted ? "✅" : isUnlocked ? "⚔️" : "🔒"}
              </div>
              <p className={`text-xs font-bold truncate ${
                isCompleted ? "text-green-400" :
                isUnlocked  ? "text-white"     :
                              "text-slate-600"
              }`}>
                {node.name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">Lv {node.level}</p>

              {isCurrent && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full" />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-6 text-xs text-slate-500">
        <span>✅ Cleared</span>
        <span>⚔️ Available</span>
        <span>🔒 Locked</span>
      </div>
    </div>
  );
}
