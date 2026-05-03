import { useGameStore } from "../store/useGameStore";

export default function BattleScreen() {
  const {
    player,
    enemy,
    battleState,
    battleLog,
    setScreen,
    playerTurn,
  } = useGameStore();

  const handleAction = (action: string) => {
    if (battleState !== "player-turn") return;
    playerTurn(action);
  };

  const petName = player.pet ? player.pet.name : "No Pet";

  return (
    <div className="flex flex-col h-full bg-slate-950 text-white p-3 gap-3">

      {/* ENEMY */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded">
        <h2 className="text-lg font-bold text-red-400">
          {enemy.name}
        </h2>
        <p className="text-sm text-slate-300">
          HP: {enemy.hp}
        </p>
      </div>

      {/* BATTLE LOG */}
      <div className="flex-1 bg-black/40 border border-slate-800 rounded p-2 overflow-y-auto">
        {battleLog.length === 0 ? (
          <p className="text-xs text-slate-500">
            Battle begins...
          </p>
        ) : (
          battleLog.map((log, i) => (
            <p key={i} className="text-xs text-slate-300">
              {log}
            </p>
          ))
        )}
      </div>

      {/* PLAYER */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded">
        <p className="font-bold text-green-400">
          HP: {player.hp}/{player.maxHp}
        </p>
        <p className="text-xs text-slate-400">
          Pet: {petName}
        </p>
      </div>

      {/* ACTIONS */}
      {battleState === "player-turn" && (
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleAction("attack")}
            className="p-3 bg-red-600 rounded font-bold"
          >
            Attack
          </button>

          <button
            onClick={() => handleAction("defend")}
            className="p-3 bg-blue-600 rounded font-bold"
          >
            Defend
          </button>

          <button
            onClick={() => handleAction("heal")}
            className="p-3 bg-green-600 rounded font-bold"
          >
            Heal
          </button>

          <button
            onClick={() => handleAction("pet")}
            className="p-3 bg-purple-600 rounded font-bold"
          >
            Pet
          </button>
        </div>
      )}

      {/* END STATE */}
      {(battleState === "victory" || battleState === "defeat") && (
        <button
          onClick={() => setScreen("town")}
          className="p-3 bg-amber-600 font-bold rounded"
        >
          Return to Town
        </button>
      )}
    </div>
  );
}