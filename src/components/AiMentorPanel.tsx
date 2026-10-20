import React, { useState } from 'react';
import { Problem } from '../types/problem';
import { 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  HelpCircle, 
  Send, 
  Copy, 
  Check, 
  Loader2,
  Terminal
} from 'lucide-react';

interface AiMentorPanelProps {
  problem: Problem;
  userCode: string;
}

export const AiMentorPanel: React.FC<AiMentorPanelProps> = ({ problem, userCode }) => {
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'hint' | 'review' | 'interview' | 'explain'>('hint');
  const [copied, setCopied] = useState(false);

  const requestAiMentor = async (mode: 'hint' | 'review' | 'interview' | 'explain') => {
    setActiveMode(mode);
    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/ai-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemTitle: problem.title,
          problemDescription: `${problem.summary}\n\nRequirements:\n${problem.requirements.join('\n')}`,
          userCode,
          mode,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setResponse(data.response || 'No response generated.');
    } catch (err: any) {
      setResponse(`AI Mentor Error: ${err.message}. Using built-in hints below:\n\n• Hint 1: ${problem.hints[0] || 'Check state dependencies'}\n• Pitfall: ${problem.pitfalls[0] || 'Avoid mutating state directly'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-full bg-slate-900 flex flex-col p-4 text-xs overflow-y-auto space-y-4">
      {/* Mentor Header */}
      <div className="flex items-center gap-2.5 p-3.5 bg-gradient-to-r from-indigo-950/80 to-purple-950/80 border border-indigo-800/50 rounded-xl">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-white text-sm">AI Senior Staff Mentor</h3>
          <p className="text-[11px] text-slate-300">Grounded in React 19, Fiber reconciliation, and senior FAANG standards</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => requestAiMentor('hint')}
          disabled={isLoading}
          className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2 ${
            activeMode === 'hint'
              ? 'bg-indigo-900/40 border-indigo-500 text-white'
              : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <div>
            <span className="font-semibold block text-white">Progressive Hint</span>
            <span className="text-[10px] text-slate-400">Guide mental model without spoiling</span>
          </div>
        </button>

        <button
          onClick={() => requestAiMentor('review')}
          disabled={isLoading}
          className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2 ${
            activeMode === 'review'
              ? 'bg-indigo-900/40 border-indigo-500 text-white'
              : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div>
            <span className="font-semibold block text-white">Review My Code</span>
            <span className="text-[10px] text-slate-400">Detect anti-patterns & performance</span>
          </div>
        </button>

        <button
          onClick={() => requestAiMentor('interview')}
          disabled={isLoading}
          className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2 ${
            activeMode === 'interview'
              ? 'bg-indigo-900/40 border-indigo-500 text-white'
              : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-purple-400 flex-shrink-0" />
          <div>
            <span className="font-semibold block text-white">Senior Interview Drill</span>
            <span className="text-[10px] text-slate-400">FAANG follow-up questions & scale</span>
          </div>
        </button>

        <button
          onClick={() => requestAiMentor('explain')}
          disabled={isLoading}
          className={`p-2.5 rounded-lg border text-left transition flex items-center gap-2 ${
            activeMode === 'explain'
              ? 'bg-indigo-900/40 border-indigo-500 text-white'
              : 'bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <div>
            <span className="font-semibold block text-white">Explain Architecture</span>
            <span className="text-[10px] text-slate-400">React Fiber internals & trade-offs</span>
          </div>
        </button>
      </div>

      {/* Response Box */}
      <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col min-h-[300px]">
        <div className="flex justify-between items-center pb-2 mb-3 border-b border-slate-800 text-[11px] text-slate-400">
          <span>Mentor Feedback</span>
          {response && (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-slate-400 py-12">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
              <p className="text-xs">Analyzing code against Staff Engineer standards...</p>
            </div>
          ) : response ? (
            <div className="text-slate-200 leading-relaxed font-sans whitespace-pre-wrap text-xs space-y-2">
              {response}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-700" />
              <p>Select any analysis mode above to get instant personalized feedback on your code and architecture.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
