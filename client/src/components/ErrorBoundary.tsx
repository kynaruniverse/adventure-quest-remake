import { Component, ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
  children: ReactNode;
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
    // simple hard reset for now
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 text-white p-6">

          <div className="w-full max-w-lg flex flex-col items-center text-center gap-4">

            <AlertTriangle size={48} className="text-red-500" />

            <h1 className="text-xl font-bold text-red-400">
              Something went wrong
            </h1>

            <p className="text-sm text-slate-400">
              The game encountered an unexpected error. You can restart to continue.
            </p>

            {this.state.error && (
              <pre className="w-full text-left text-xs bg-slate-900 p-3 rounded border border-slate-800 overflow-auto text-slate-300">
                {this.state.error.stack}
              </pre>
            )}

            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded bg-amber-600 text-white font-bold hover:bg-amber-500 transition"
            >
              <RotateCcw size={16} />
              Restart Game
            </button>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}