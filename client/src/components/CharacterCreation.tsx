import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { CHARACTER_CLASSES, CharacterClass } from "../lib/characterClasses";
import { createPlayerFromClass } from "../lib/characterFactory";

/**
 * =========================
 * CHARACTER CREATION
 * =========================
 *
 * FIX BUG-10: Was orphaned — never rendered by GameManager.
 * Now the initial scene. On submit, calls initializePlayer
 * and navigates to town.
 *
 * Visually upgraded: class cards, stat bars, animated transitions.
 */

const CLASS_ICONS: Record<CharacterClass, string> = {
  Warrior:  "⚔️",
  Mage:     "🔮",
  Ranger:   "🏹",
  Rogue:    "🗡️",
  Paladin:  "🛡️",
  Shaman:   "🌿",
};

const CLASS_COLORS: Record<CharacterClass, string> = {
  Warrior:  "from-red-900/60   to-red-800/30   border-red-600/40",
  Mage:     "from-violet-900/60 to-violet-800/30 border-violet-500/40",
  Ranger:   "from-green-900/60  to-green-800/30  border-green-600/40",
  Rogue:    "from-slate-800/60  to-slate-700/30  border-slate-500/40",
  Paladin:  "from-amber-900/60  to-amber-800/30  border-amber-500/40",
  Shaman:   "from-teal-900/60   to-teal-800/30   border-teal-500/40",
};

const STAT_LABELS: { key: keyof ReturnType<typeof CHARACTER_CLASSES[CharacterClass]["baseStats"]>; label: string; color: string }[] = [
  { key: "str", label: "STR", color: "bg-red-500"    },
  { key: "dex", label: "DEX", color: "bg-green-500"  },
  { key: "int", label: "INT", color: "bg-blue-500"   },
  { key: "end", label: "END", color: "bg-orange-500" },
  { key: "cha", label: "CHA", color: "bg-pink-500"   },
  { key: "luk", label: "LUK", color: "bg-yellow-400" },
];

export default function CharacterCreation() {
  const initializePlayer = useGameStore((s) => s.initializePlayer);

  const [name, setName]           = useState("");
  const [selectedClass, setSelectedClass] = useState<CharacterClass | null>(null);
  const [step, setStep]           = useState<"class" | "name">("class");

  const classDef = selectedClass ? CHARACTER_CLASSES[selectedClass] : null;

  function handleClassSelect(cls: CharacterClass) {
    setSelectedClass(cls);
  }

  function handleNext() {
    if (!selectedClass) return;
    setStep("name");
  }

  function handleStart() {
    if (!selectedClass) return;
    const playerName = name.trim() || "Adventurer";
    const player = createPlayerFromClass(playerName, selectedClass);
    initializePlayer(player, selectedClass);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col items-center justify-center px-4 py-8">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-amber-400 tracking-widest uppercase drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]">
          Adventure Quest
        </h1>
        <p className="text-slate-400 text-sm mt-1 tracking-widest uppercase">
          Choose Your Path
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* STEP 1: CLASS SELECTION */}
        {step === "class" && (
          <motion.div
            key="class"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full max-w-2xl"
          >
            <h2 className="text-center text-slate-300 text-lg font-semibold mb-4">
              Select your class
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {(Object.keys(CHARACTER_CLASSES) as CharacterClass[]).map((cls) => {
                const def = CHARACTER_CLASSES[cls];
                const isSelected = selectedClass === cls;

                return (
                  <motion.button
                    key={cls}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleClassSelect(cls)}
                    className={`
                      relative p-4 rounded-xl border-2 text-left transition-all duration-200
                      bg-gradient-to-b ${CLASS_COLORS[cls]}
                      ${isSelected
                        ? "border-opacity-100 ring-2 ring-amber-400/60 shadow-lg shadow-amber-900/30"
                        : "border-opacity-40 hover:border-opacity-80"}
                    `}
                  >
                    <div className="text-3xl mb-2">{CLASS_ICONS[cls]}</div>
                    <div className="font-bold text-white text-sm">{cls}</div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-tight">
                      {def.description}
                    </div>
                    {isSelected && (
                      <motion.div
                        layoutId="selected-badge"
                        className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center"
                      >
                        <span className="text-[8px] text-slate-900 font-bold">✓</span>
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Stat preview */}
            <AnimatePresence>
              {classDef && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-4 mb-5"
                >
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">
                    Base Stats — {selectedClass}
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    {STAT_LABELS.map(({ key, label, color }) => {
                      const val = classDef.baseStats[key as keyof typeof classDef.baseStats] ?? 0;
                      const pct = Math.min(100, (val / 20) * 100);
                      return (
                        <div key={key} className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 w-7 text-right">{label}</span>
                          <div className="flex-1 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ duration: 0.4, ease: "easeOut" }}
                              className={`h-full rounded-full ${color}`}
                            />
                          </div>
                          <span className="text-xs text-slate-300 w-5">{val}</span>
                        </div>
                      );
                    })}
                  </div>
                  {classDef.startingSpell && (
                    <p className="text-xs text-amber-400/70 mt-3">
                      ✦ Starting spell: <span className="text-amber-400">{classDef.startingSpell}</span>
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={!selectedClass}
              onClick={handleNext}
              className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-200
                disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed
                enabled:bg-amber-500 enabled:hover:bg-amber-400 enabled:text-slate-950 enabled:shadow-lg enabled:shadow-amber-900/40"
            >
              Continue →
            </motion.button>
          </motion.div>
        )}

        {/* STEP 2: NAME */}
        {step === "name" && (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-sm"
          >
            <div className="text-center mb-6">
              <div className="text-5xl mb-2">{selectedClass ? CLASS_ICONS[selectedClass] : ""}</div>
              <div className="text-white font-bold text-xl">{selectedClass}</div>
              <div className="text-slate-400 text-sm mt-1">
                {classDef?.description}
              </div>
            </div>

            <label className="block text-xs text-slate-400 uppercase tracking-widest mb-2">
              Your name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              placeholder="Adventurer"
              maxLength={20}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-xl px-4 py-3 text-base
                focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 mb-6 placeholder:text-slate-600"
              autoFocus
            />

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleStart}
              className="w-full py-3 rounded-xl font-bold text-sm uppercase tracking-widest
                bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-900/40 transition-all"
            >
              Begin Adventure ⚔
            </motion.button>

            <button
              onClick={() => setStep("class")}
              className="w-full mt-3 py-2 text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Back to class selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
