import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  resetKey: string | number;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class PreviewErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LivePreview Runtime Error:', error, errorInfo);
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false, error: null });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-rose-950/80 border border-rose-800 rounded-lg text-rose-200 text-xs">
          <div className="flex items-center gap-2 font-bold mb-2 text-rose-300">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>React Runtime Render Error</span>
          </div>
          <pre className="font-mono bg-black/40 p-2.5 rounded overflow-x-auto text-[11px] whitespace-pre-wrap">
            {this.state.error?.message || 'Unknown runtime error occurred in component.'}
          </pre>
          <p className="mt-2 text-slate-400 text-[10px]">
            Check hook dependencies, null safety, or check the Solution tab for reference.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}

interface LivePreviewProps {
  component: React.ComponentType<any> | null;
  transpileError?: string;
  onRefresh: () => void;
  renderKey: number;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  component: ComponentToRender,
  transpileError,
  onRefresh,
  renderKey,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
      {/* Sandbox Header */}
      <div className="px-3.5 py-2 bg-slate-900 border-b border-slate-800 flex justify-between items-center text-xs">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="font-semibold text-slate-300 ml-1">Live Interactive Sandbox</span>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-mono">
            Isolated Fiber
          </span>
        </div>

        <button
          onClick={onRefresh}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition"
          title="Remount component and clear state"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset View</span>
        </button>
      </div>

      {/* Sandbox Body */}
      <div className="flex-1 p-4 overflow-auto flex flex-col justify-center items-center bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
        {transpileError ? (
          <div className="w-full max-w-md p-4 bg-rose-950/70 border border-rose-800/80 rounded-lg text-rose-300 text-xs">
            <div className="flex items-center gap-2 font-bold mb-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Compilation / Syntax Error</span>
            </div>
            <pre className="font-mono text-[11px] bg-black/40 p-2 rounded overflow-x-auto text-rose-200 whitespace-pre-wrap">
              {transpileError}
            </pre>
          </div>
        ) : ComponentToRender ? (
          <div className="w-full" id="sandbox-root-container">
            <PreviewErrorBoundary resetKey={renderKey}>
              <ComponentToRender />
            </PreviewErrorBoundary>
          </div>
        ) : (
          <div className="text-center text-slate-500 text-xs">
            Click "Run Code" above to compile and execute your component live.
          </div>
        )}
      </div>
    </div>
  );
};
