import { Component, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;

  /**
   * Optional safe reset hook from Zustand/store
   * (preferred over full page reload)
   */
  onReset?: () => void;

  /**
   * Optional navigation fallback (e.g. return to town)
   */
  onRecover?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  handleReset = () => {
    // Preferred: reset via game store / safe engine reset
    if (this.props.onReset) {
      this.props.onReset();
      return;
    }

    // Secondary: recover to safe state (e.g. town)
    if (this.props.onRecover) {
      this.props.onRecover();
      return;
    }

    // Last resort fallback (should rarely happen)
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const isDev = process.env.NODE_ENV === "development";

    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white p-6">
        <div className="w-full max-w-lg flex flex-col items-center text-center gap-4">

          {/* ICON */}
          <AlertTriangle size={48} className="text-red-500" />

          {/* TITLE */}
          <h1 className="text-xl font-bold text-red-400">
            Something went wrong
          </h1>

          {/* MESSAGE */}
          <p className="text-sm text-slate-400">
            The game encountered an unexpected error. You can recover or restart safely.
          </p>

          {/* DEV ERROR DETAILS ONLY */}
          {isDev && this.state.error && (
            <pre className="w-full text-left text-xs bg-slate-900 p-3 rounded border border-slate-800 overflow-auto text-slate-300">
              {this.state.error.stack}
            </pre>
          )}

          {/* RECOVERY BUTTON */}
          <button
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded bg-amber-600 text-white font-bold hover:bg-amber-500 transition"
          >
            <RotateCcw size={16} />
            Recover Game
          </button>

        </div>
      </div>
    );
  }
}