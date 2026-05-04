import ErrorBoundary from "./components/ErrorBoundary";
import GameManager from "./components/GameManager";

/**
 * =========================
 * APP ROOT
 * =========================
 *
 * Minimal wrapper. All game logic lives in GameManager + useGameStore.
 */

function App() {
  return (
    <ErrorBoundary>
        <TooltipProvider>
          <Toaster position="top-center" richColors />
          <div className="h-screen w-screen overflow-hidden bg-slate-950 font-sans">
            <GameManager />
          </div>
        </TooltipProvider>
    </ErrorBoundary>
  );
}

export default App;
