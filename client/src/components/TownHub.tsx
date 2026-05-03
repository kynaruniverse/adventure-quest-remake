import { useGameStore } from "../store/useGameStore";

export default function TownHub() {
  const setScreen = useGameStore((s) => s.setScreen);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-4 bg-slate-950 text-white p-6">

      {/* TITLE */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black text-amber-500 uppercase">
          Town Hub
        </h1>
        <p className="text-xs text-slate-400 uppercase tracking-widest">
          Choose your path
        </p>
      </div>

      {/* MAIN ACTIONS */}
      <div className="flex flex-col gap-3 w-full max-w-xs">

        <button
          onClick={() => setScreen("battle")}
          className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold uppercase rounded"
        >
          ⚔ Start Battle
        </button>

        <button
          onClick={() => setScreen("shop")}
          className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-bold uppercase rounded"
        >
          🛒 Shop
        </button>

        {/* FUTURE PROGRESSION HOOK */}
        <button
          onClick={() => setScreen("map")}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase rounded opacity-70"
        >
          🌍 Map (Coming Soon)
        </button>

      </div>

    </div>
  );
}