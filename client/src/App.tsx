import ErrorBoundary from "./components/ErrorBoundary";
import GameManager from "./components/GameManager";

/**
 * =========================
 * APP ROOT
 * =========================
 *
 * Minimal wrapper. All game logic lives in GameManager + useGameStore.
 * ThemeContext is now a real module (was missing, crashed the app).
 */

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster position="top-center" richColors />
          <div className="h-screen w-screen overflow-hidden bg-slate-950 font-sans">
            <GameManager />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
