import { Component, ErrorInfo, ReactNode } from "react";

/**
 * =========================
 * ERROR BOUNDARY
 * =========================
 *
 * Production-quality error boundary.
 * Strategy:
 *   1. Try to recover the game by resetting just the scene stack.
 *   2. If that fails, offer a full new game.
 *   3. Last resort: full page reload.
 */

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  recovered: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, recovered: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, recovered: false };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[AdventureQuest] Runtime error:", error, info.componentStack);
  }

  handleRecoverScene = () => {
    try {
      // Try to navigate back to town using the store
      const { useGameStore } = require("../store/useGameStore");
      useGameStore.getState().clearScenes();
      this.setState({ hasError: false, error: null, recovered: true });
    } catch {
      this.handleNewGame();
    }
  };

  handleNewGame = () => {
    try {
      const { useGameStore } = require("../store/useGameStore");
      useGameStore.getState().newGame();
      this.setState({ hasError: false, error: null, recovered: false });
    } catch {
      localStorage.clear();
      window.location.reload();
    }
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-5xl mb-4">💀</div>

        <h1 className="text-red-400 font-bold text-2xl mb-2">
          Something went wrong
        </h1>

        <p className="text-slate-400 text-sm max-w-sm mb-6">
          The game encountered an unexpected error. Your progress has been saved.
        </p>

        {import.meta.env.DEV && this.state.error && (
          <pre className="text-xs text-left text-red-300 bg-red-950/40 border border-red-900/40 rounded-xl p-4 mb-6 max-w-sm overflow-x-auto">
            {this.state.error.message}
          </pre>
        )}

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={this.handleRecoverScene}
            className="py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-colors"
          >
            Return to Town
          </button>
          <button
            onClick={this.handleNewGame}
            className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-colors"
          >
            Start New Game
          </button>
          <button
            onClick={this.handleReload}
            className="py-2 text-xs text-slate-600 hover:text-slate-400 transition-colors"
          >
            Reload page
          </button>
        </div>
      </div>
    );
  }
}
