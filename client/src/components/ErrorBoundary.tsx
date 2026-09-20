import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  fallbackMessage?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 rounded-2xl bg-slate-900 border border-red-500/20 text-slate-200 flex flex-col items-center justify-center text-center gap-4 my-4 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center text-xl font-bold">
            ⚠️
          </div>
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              {this.props.fallbackTitle || 'Workspace Component Error'}
            </h3>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              {this.props.fallbackMessage || 'An unexpected rendering error occurred in this workspace view.'}
            </p>
            {this.state.error?.message && (
              <p className="text-[11px] font-mono text-red-400/80 bg-slate-950 p-2.5 rounded-lg border border-slate-800 mt-3 text-left overflow-x-auto max-w-lg">
                {this.state.error.message}
              </p>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20"
          >
            Retry Workspace Component
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
