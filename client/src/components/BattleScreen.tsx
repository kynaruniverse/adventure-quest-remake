import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "../store/useGameStore";
import { Action } from "../lib/effectEngine";

/**
 * =========================
 * BATTLE SCREEN
 * =========================
 *
 * FIX BUG-05: setScreen removed — uses popScene / clearScenes.
 * FIX BUG-08: All 4 actions shown (attack, heal, defend, pet).
 * ADDED: Victory rewards display with EXP + gold + level-up banner.
 * ADDED: Defeat screen with retry / return options.
 * ADDED: Animated battle log with auto-scroll.
 * ADDED: Animated HP bars for player and enemy.
 * ADDED: Turn indicator badge.
 */

export default function BattleScreen() {
  const player      = useGameStore((s) => s.player);
  const enemy       = useGameStore((s) => s.enemy);
  const battleState = useGameStore((s) => s.battleState);
  const battleLog   = useGameStore((s) => s.battleLog);
  const lastRewards = useGameStore((s) => s.lastRewards);
  const playerTurn  = useGameStore((s) => s.playerTurn);
  const resetBattle = useGameStore((s) => s.resetBattle);
  const startBattle = useGameStore((s) => s.startBattle);

  const playerHpPct = Math.max(0, (player.hp / player.maxHp) * 100);
  const enemyHpPct  = Math.max(0, (enemy.hp  / enemy.maxHp)  * 100);

  const isPlayerTurn = battleState === "player-turn";
  const isEnemyTurn  = battleState === "enemy-turn";
  const isVictory    = battleState === "victory";
  const isDefeat     = battleState === "defeat";

  const actions: { id: Action; label: string; icon: string; color: string; disabled?: boolean }[] = [
    {
      id: "attack",
      label: "Attack",
      icon: "⚔️",
      color: "bg-red-900/60 hover:bg-red-800/80 border-red-700/50 hover:border-red-500",
    },
    {
      id: "heal",
      label: "Heal",
      icon: "💚",
      color: "bg-green-900/60 hover:bg-green-800/80 border-green-700/50 hover:border-green-500",
    },
    {
      id: "defend",
      label: "Defend",
      icon: "🛡️",
      color: "bg-blue-900/60 hover:bg-blue-800/80 border-blue-700/50 hover:border-blue-500",
    },
    {
      id: "pet",
      label: player.pet?.name ?? "No Pet",
      icon: "🐾",
      color: "bg-violet-900/60 hover:bg-violet-800/80 border-violet-700/50 hover:border-violet-500",
      disabled: !player.pet,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col max-w-lg mx-auto px-4 py-5">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={resetBattle}
          className="text-slate-500 hover:text-slate-300 text-sm transition-colors"
        >
          ← Flee
        </button>

        <div className={`
          px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest
          ${isPlayerTurn ? "bg-amber-500/20 text-amber-400 border border-amber-600/40" :
            isEnemyTurn  ? "bg-red-500/20   text-red-400   border border-red-600/40"   :
            isVictory    ? "bg-green-500/20  text-green-400  border border-green-600/40" :
                           "bg-red-900/40   text-red-300   border border-red-800/40"}
        `}>
          {isPlayerTurn ? "Your Turn"    :
           isEnemyTurn  ? "Enemy Turn"   :
           isVictory    ? "Victory! 🎉"  :
           isDefeat     ? "Defeated 💀"  : "..."}
        </div>

        <div className="text-xs text-slate-500">Lv {player.level}</div>
      </div>

      {/* === COMBATANTS === */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Player */}
        <CombatantCard
          name={player.name}
          subtitle={player.class ?? "Adventurer"}
          hp={player.hp}
          maxHp={player.maxHp}
          hpPct={playerHpPct}
          icon="🧙"
          isPlayer
          defending={player.defending}
        />

        {/* Enemy */}
        <CombatantCard
          name={enemy.name}
          subtitle={`Lv ${enemy.level} · ${enemy.element ?? ""}`}
          hp={enemy.hp}
          maxHp={enemy.maxHp}
          hpPct={enemyHpPct}
          icon="👹"
        />
      </div>

      {/* === ACTION BUTTONS === */}
      <AnimatePresence>
        {isPlayerTurn && (
          <motion.div
            key="actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="grid grid-cols-2 gap-2 mb-4"
          >
            {actions.map((act) => (
              <motion.button
                key={act.id}
                whileTap={{ scale: 0.95 }}
                disabled={act.disabled}
                onClick={() => playerTurn(act.id)}
                className={`
                  p-3 rounded-xl border text-left transition-all duration-150
                  ${act.color}
                  ${act.disabled ? "opacity-40 cursor-not-allowed" : ""}
                `}
              >
                <span className="text-xl">{act.icon}</span>
                <div className="text-white font-bold text-sm mt-1">{act.label}</div>
              </motion.button>
            ))}
          </motion.div>
        )}

        {isEnemyTurn && (
          <motion.div
            key="enemy-turn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center h-24 mb-4"
          >
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-red-400 rounded-full"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === VICTORY === */}
      <AnimatePresence>
        {isVictory && lastRewards && (
          <motion.div
            key="victory"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-950/60 border border-green-700/40 rounded-2xl p-5 mb-4 text-center"
          >
            <div className="text-3xl mb-2">🎉</div>
            <h2 className="text-green-400 font-bold text-xl mb-1">Victory!</h2>

            {lastRewards.leveledUp && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-3 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full inline-block"
              >
                <span className="text-amber-400 font-bold text-sm">⬆ LEVEL UP! Now Lv {player.level}</span>
              </motion.div>
            )}

            <div className="flex justify-center gap-6 text-sm mt-2">
              <div>
                <p className="text-slate-400 text-xs">EXP</p>
                <p className="text-amber-400 font-bold">+{lastRewards.exp}</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">Gold</p>
                <p className="text-yellow-400 font-bold">+{lastRewards.gold} 💰</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => startBattle(player.level)}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
              >
                Fight Again
              </button>
              <button
                onClick={resetBattle}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors"
              >
                Return to Town
              </button>
            </div>
          </motion.div>
        )}

        {/* === DEFEAT === */}
        {isDefeat && (
          <motion.div
            key="defeat"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-950/60 border border-red-700/40 rounded-2xl p-5 mb-4 text-center"
          >
            <div className="text-3xl mb-2">💀</div>
            <h2 className="text-red-400 font-bold text-xl mb-1">Defeated</h2>
            <p className="text-slate-400 text-sm mb-4">
              You were bested. Regroup and try again.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => startBattle(Math.max(1, enemy.level - 1))}
                className="flex-1 py-2.5 rounded-xl bg-red-800 hover:bg-red-700 text-white font-bold text-sm transition-colors"
              >
                Retry
              </button>
              <button
                onClick={resetBattle}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm transition-colors"
              >
                Return to Town
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === BATTLE LOG === */}
      <div className="flex-1 bg-slate-900/50 border border-slate-800/50 rounded-xl p-3 overflow-y-auto max-h-44">
        <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Battle Log</p>
        <div className="flex flex-col-reverse gap-0.5">
          {[...battleLog].reverse().map((line, i) => (
            <motion.p
              key={`${line}-${i}`}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className={`text-xs leading-relaxed ${
                i === 0 ? "text-white" : "text-slate-500"
              }`}
            >
              {line}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── COMBATANT CARD ──────────────────────────────────────────

function CombatantCard({
  name, subtitle, hp, maxHp, hpPct, icon, isPlayer = false, defending = false,
}: {
  name: string;
  subtitle: string;
  hp: number;
  maxHp: number;
  hpPct: number;
  icon: string;
  isPlayer?: boolean;
  defending?: boolean;
}) {
  return (
    <div className={`
      p-3 rounded-xl border bg-slate-900/60
      ${isPlayer ? "border-amber-800/40" : "border-red-900/40"}
    `}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">{icon}</span>
        <div className="min-w-0">
          <p className="font-bold text-white text-sm truncate">{name}</p>
          <p className="text-xs text-slate-500 truncate">{subtitle}</p>
        </div>
        {defending && (
          <span className="ml-auto text-blue-400 text-base">🛡</span>
        )}
      </div>

      <div className="flex justify-between text-xs mb-1">
        <span className={isPlayer ? "text-green-400" : "text-red-400"}>HP</span>
        <span className="text-slate-400">{hp}/{maxHp}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${hpPct}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`h-full rounded-full ${
            hpPct > 60 ? "bg-green-500" :
            hpPct > 30 ? "bg-yellow-500" :
                         "bg-red-500"
          }`}
        />
      </div>
    </div>
  );
}
