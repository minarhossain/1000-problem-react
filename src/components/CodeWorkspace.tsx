import React, { useState, useEffect, useRef } from 'react';
import { Problem, TestCase } from '../types/problem';
import { transpileAndMount, RunTestResult } from '../utils/codeRunner';
import { LivePreview } from './LivePreview';
import confetti from 'canvas-confetti';
import { 
  Play, 
  CheckCircle, 
  RotateCcw, 
  Copy, 
  Check, 
  Lightbulb, 
  CheckCircle2, 
  XCircle,
  Code2
} from 'lucide-react';

interface CodeWorkspaceProps {
  problem: Problem;
  userCode: string;
  onCodeChange: (code: string) => void;
  onMarkSolved: () => void;
  isSolved: boolean;
}

export const CodeWorkspace: React.FC<CodeWorkspaceProps> = ({
  problem,
  userCode,
  onCodeChange,
  onMarkSolved,
  isSolved,
}) => {
  const [compiledComponent, setCompiledComponent] = useState<React.ComponentType<any> | null>(null);
  const [transpileError, setTranspileError] = useState<string | undefined>();
  const [renderKey, setRenderKey] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [activeRightTab, setActiveRightTab] = useState<'preview' | 'tests'>('preview');
  const [testResults, setTestResults] = useState<RunTestResult[]>([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Compile on mount or when problem changes
  const executeCode = (codeToRun: string = userCode) => {
    const res = transpileAndMount(codeToRun);
    if (res.success && res.component) {
      setCompiledComponent(() => res.component!);
      setTranspileError(undefined);
      setRenderKey(k => k + 1);
    } else {
      setCompiledComponent(null);
      setTranspileError(res.error || 'Failed to transpile code.');
    }
  };

  useEffect(() => {
    executeCode(userCode);
    setTestResults([]);
  }, [problem.id]);

  const handleRun = () => {
    executeCode(userCode);
  };

  const handleResetStarter = () => {
    if (window.confirm('Reset code back to the initial starter template?')) {
      onCodeChange(problem.starterCode);
      executeCode(problem.starterCode);
    }
  };

  const handleLoadSolution = () => {
    if (window.confirm('Load the official reference solution into your editor?')) {
      onCodeChange(problem.solutionCode);
      executeCode(problem.solutionCode);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(userCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Run automated test suite against rendered component
  const handleRunTests = async () => {
    setIsRunningTests(true);
    setActiveRightTab('tests');
    executeCode(userCode);

    // Allow DOM to paint
    await new Promise(r => setTimeout(r, 200));

    const testCases: TestCase[] = problem.testCases || [
      {
        id: 'tc_default',
        name: 'Basic DOM mount assertion',
        description: 'Verify component renders DOM elements without throwing',
        assertionCode: 'return document.getElementById("sandbox-root-container") !== null;',
      },
    ];

    const results: RunTestResult[] = [];
    let allPassed = true;

    for (const tc of testCases) {
      const startTime = performance.now();
      try {
        const testFn = new Function(tc.assertionCode);
        const passed = Boolean(testFn());
        results.push({
          testId: tc.id,
          name: tc.name,
          passed,
          durationMs: Math.round(performance.now() - startTime),
        });
        if (!passed) allPassed = false;
      } catch (err: any) {
        allPassed = false;
        results.push({
          testId: tc.id,
          name: tc.name,
          passed: false,
          error: err.message || String(err),
          durationMs: Math.round(performance.now() - startTime),
        });
      }
    }

    setTestResults(results);
    setIsRunningTests(false);

    if (allPassed && testCases.length > 0) {
      onMarkSolved();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  };

  // Handle Tab key in code editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const newValue = userCode.substring(0, start) + '  ' + userCode.substring(end);
      onCodeChange(newValue);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      {/* Editor toolbar */}
      <div className="p-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-slate-300">Solution Workspace</span>
          <span className="text-[10px] text-slate-400 font-mono">React 19 + TypeScript</span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleRun}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-900/30 transition"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Run Code</span>
          </button>

          <button
            onClick={handleRunTests}
            disabled={isRunningTests}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-semibold shadow-md shadow-emerald-900/30 transition"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{isRunningTests ? 'Running...' : 'Run Tests'}</span>
          </button>

          <button
            onClick={handleLoadSolution}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition"
            title="Load reference solution"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Solution</span>
          </button>

          <button
            onClick={handleResetStarter}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
            title="Reset to starter"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700"
            title="Copy Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Split pane: Editor Left, Live Preview / Tests Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2 p-2 overflow-hidden min-h-0">
        {/* Left: Code Editor */}
        <div className="flex flex-col h-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
          <div className="px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 flex justify-between items-center font-mono">
            <span>WorkspaceComponent.tsx</span>
            <span>Tab = 2 spaces</span>
          </div>
          <div className="flex-1 relative overflow-auto">
            <textarea
              ref={textareaRef}
              value={userCode}
              onChange={(e) => onCodeChange(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="w-full h-full p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none selection:bg-indigo-600/40"
              placeholder="// Write your React code here..."
            />
          </div>
        </div>

        {/* Right: Live Preview or Test Results */}
        <div className="flex flex-col h-full overflow-hidden">
          {/* Tab selector */}
          <div className="flex gap-1 mb-2">
            <button
              onClick={() => setActiveRightTab('preview')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeRightTab === 'preview'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'bg-slate-900/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              Live Component Preview
            </button>
            <button
              onClick={() => setActiveRightTab('tests')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                activeRightTab === 'tests'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'bg-slate-900/50 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Automated Tests</span>
              {testResults.length > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  testResults.every(t => t.passed) 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/20 text-rose-400'
                }`}>
                  {testResults.filter(t => t.passed).length}/{testResults.length}
                </span>
              )}
            </button>
          </div>

          <div className="flex-1 min-h-0">
            {activeRightTab === 'preview' ? (
              <LivePreview
                component={compiledComponent}
                transpileError={transpileError}
                onRefresh={() => setRenderKey(k => k + 1)}
                renderKey={renderKey}
              />
            ) : (
              <div className="h-full bg-slate-950 border border-slate-800 rounded-lg p-4 overflow-y-auto space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                  <h3 className="font-bold text-white">Automated Acceptance Test Suite</h3>
                  <button
                    onClick={handleRunTests}
                    className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-xs text-white font-medium"
                  >
                    Re-run All
                  </button>
                </div>

                {testResults.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">
                    <p>No tests run yet.</p>
                    <button
                      onClick={handleRunTests}
                      className="mt-3 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                    >
                      Run Verification Tests
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {testResults.map((result) => (
                      <div
                        key={result.testId}
                        className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                          result.passed
                            ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                            : 'bg-rose-950/30 border-rose-800/60 text-rose-200'
                        }`}
                      >
                        {result.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">{result.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">
                              {result.durationMs}ms
                            </span>
                          </div>
                          {result.error && (
                            <p className="mt-1 font-mono text-[11px] text-rose-300 bg-black/40 p-1.5 rounded">
                              {result.error}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
