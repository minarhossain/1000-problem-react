import React, { useState } from 'react';
import { Problem, UserProgress } from '../types/problem';
import { CodeWorkspace } from './CodeWorkspace';
import { AiMentorPanel } from './AiMentorPanel';
import { 
  FileText, 
  Code, 
  Lightbulb, 
  Sparkles, 
  StickyNote, 
  CheckCircle2, 
  Circle, 
  Bookmark, 
  Clock, 
  Building2, 
  AlertTriangle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';

interface ProblemDetailProps {
  problem: Problem;
  progress: UserProgress;
  onToggleSolved: (id: number) => void;
  onToggleBookmark: (id: number) => void;
  userCode: string;
  onCodeChange: (code: string) => void;
  userNotes: string;
  onSaveNotes: (notes: string) => void;
  onNextProblem: () => void;
  onPrevProblem: () => void;
}

export const ProblemDetail: React.FC<ProblemDetailProps> = ({
  problem,
  progress,
  onToggleSolved,
  onToggleBookmark,
  userCode,
  onCodeChange,
  userNotes,
  onSaveNotes,
  onNextProblem,
  onPrevProblem,
}) => {
  const [activeTab, setActiveTab] = useState<'problem' | 'workspace' | 'solution' | 'ai' | 'notes'>('workspace');
  const isSolved = progress.completedProblemIds.includes(problem.id);
  const isBookmarked = progress.bookmarkedProblemIds.includes(problem.id);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 overflow-hidden">
      {/* Top Problem Header */}
      <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleSolved(problem.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition font-semibold text-xs"
            style={{
              borderColor: isSolved ? 'rgba(16, 185, 129, 0.4)' : 'rgba(71, 85, 105, 0.5)',
              backgroundColor: isSolved ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
              color: isSolved ? '#34d399' : '#94a3b8',
            }}
          >
            {isSolved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Circle className="w-4 h-4" />}
            <span>{isSolved ? 'Solved' : 'Mark Solved'}</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-400 font-bold text-xs">#{problem.id}</span>
              <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">{problem.title}</h1>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
              <span>{problem.moduleName}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {problem.timeEstimate}</span>
              {problem.companies && problem.companies.length > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <Building2 className="w-3 h-3 text-indigo-400" />
                    {problem.companies.join(', ')}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onToggleBookmark(problem.id)}
            className={`p-2 rounded-lg border transition ${
              isBookmarked 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' 
                : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
            }`}
            title="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-400' : ''}`} />
          </button>

          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button
              onClick={onPrevProblem}
              className="px-2 py-1 hover:bg-slate-700 rounded text-slate-300 text-xs transition"
              title="Previous problem"
            >
              ← Prev
            </button>
            <span className="text-slate-600">|</span>
            <button
              onClick={onNextProblem}
              className="px-2 py-1 hover:bg-slate-700 rounded text-slate-300 text-xs transition"
              title="Next problem"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 text-xs overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('workspace')}
          className={`flex items-center gap-1.5 px-3 py-2.5 font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === 'workspace'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Interactive Sandbox</span>
        </button>

        <button
          onClick={() => setActiveTab('problem')}
          className={`flex items-center gap-1.5 px-3 py-2.5 font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === 'problem'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Requirements & Model</span>
        </button>

        <button
          onClick={() => setActiveTab('solution')}
          className={`flex items-center gap-1.5 px-3 py-2.5 font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === 'solution'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          <span>Deep-Dive Solution</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-1.5 px-3 py-2.5 font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === 'ai'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AI Senior Mentor</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center gap-1.5 px-3 py-2.5 font-semibold border-b-2 transition whitespace-nowrap ${
            activeTab === 'notes'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <StickyNote className="w-3.5 h-3.5" />
          <span>My Notes</span>
          {userNotes && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-hidden min-h-0">
        {activeTab === 'workspace' && (
          <CodeWorkspace
            problem={problem}
            userCode={userCode}
            onCodeChange={onCodeChange}
            onMarkSolved={() => onToggleSolved(problem.id)}
            isSolved={isSolved}
          />
        )}

        {activeTab === 'problem' && (
          <div className="h-full overflow-y-auto p-6 max-w-3xl space-y-6 text-xs text-slate-300">
            {/* Summary */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-2">Problem Overview</h3>
              <p className="leading-relaxed text-slate-300">{problem.summary}</p>
            </div>

            {/* Core Mental Model */}
            <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/60">
              <h3 className="text-sm font-bold text-indigo-300 mb-1 flex items-center gap-2">
                <span>🧠</span> Core Senior Mental Model
              </h3>
              <p className="text-slate-200 leading-relaxed font-sans">{problem.mentalModelTakeaway}</p>
            </div>

            {/* Requirements */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white">Acceptance Criteria & Specifications</h3>
              <ul className="space-y-2">
                {problem.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 bg-slate-950/40 p-3 rounded-lg border border-slate-800/80">
                    <span className="text-indigo-400 font-bold mt-0.5">•</span>
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Common Pitfalls */}
            {problem.pitfalls && problem.pitfalls.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-rose-300 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Crucial Pitfalls & Bugs to Avoid</span>
                </h3>
                <ul className="space-y-2">
                  {problem.pitfalls.map((pit, i) => (
                    <li key={i} className="bg-rose-950/20 border border-rose-900/40 p-3 rounded-lg text-rose-200 leading-relaxed">
                      ⚠️ {pit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Senior Interview Follow-ups */}
            {problem.interviewFollowUps && problem.interviewFollowUps.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>FAANG Senior Interview Follow-Up Questions</span>
                </h3>
                <ul className="space-y-2">
                  {problem.interviewFollowUps.map((q, i) => (
                    <li key={i} className="bg-amber-950/20 border border-amber-900/40 p-3 rounded-lg text-amber-200 leading-relaxed">
                      💬 "{q}"
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === 'solution' && (
          <div className="h-full overflow-y-auto p-6 max-w-4xl space-y-6 text-xs text-slate-300">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-white">Production Reference Solution</h2>
                <p className="text-slate-400 text-xs">Standard architecture meeting Senior/Staff level requirements</p>
              </div>
              <button
                onClick={() => onCodeChange(problem.solutionCode)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-semibold"
              >
                Copy to Workspace
              </button>
            </div>

            {/* Explanation */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-slate-300 leading-relaxed space-y-2">
              <h3 className="text-sm font-bold text-white">Architectural Breakdown</h3>
              <p>{problem.explanation}</p>
            </div>

            {/* Code */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 flex justify-between">
                <span>Solution.tsx</span>
                <span className="text-emerald-400">Production Ready</span>
              </div>
              <pre className="p-4 text-slate-200 overflow-x-auto leading-relaxed">
                {problem.solutionCode}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <AiMentorPanel problem={problem} userCode={userCode} />
        )}

        {activeTab === 'notes' && (
          <div className="h-full p-6 flex flex-col max-w-3xl space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-white">Personal Problem Notes</h3>
                <p className="text-xs text-slate-400">Save key insights, interviewer tips, or formulas for this challenge</p>
              </div>
              <span className="text-[11px] text-emerald-400">Auto-saved to LocalStorage</span>
            </div>
            <textarea
              value={userNotes}
              onChange={(e) => onSaveNotes(e.target.value)}
              placeholder="Write your notes, edge-case reminders, or interview takeaways here..."
              className="flex-1 w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-xs leading-relaxed focus:outline-none focus:border-indigo-500 resize-none font-sans"
            />
          </div>
        )}
      </div>
    </div>
  );
};
