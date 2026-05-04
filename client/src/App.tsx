import ErrorBoundary from "./components/ErrorBoundary";
import GameManager from "./components/GameManager";

function App() {
  return (
    <ErrorBoundary>
      <div className="h-screen w-screen overflow-hidden bg-slate-950 font-sans">
        <GameManager />
      </div>
    </ErrorBoundary>
  );
}

export default App; // <--- MAKE SURE THIS LINE EXISTS
