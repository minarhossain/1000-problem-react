import React from 'react';
import { Problem, Difficulty, UserProgress } from '../types/problem';
import { 
  CheckCircle2, 
  Circle, 
  Bookmark, 
  Clock, 
  Building2, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface ProblemListProps {
  problems: Problem[];
  activeProblemId: number;
  onSelectProblem: (id: number) => void;
  progress: UserProgress;
  onToggleSolved: (id: number) => void;
  onToggleBookmark: (id: number) => void;
  selectedDifficulty: Difficulty | 'all';
  onChangeDifficulty: (d: Difficulty | 'all') => void;
  selectedStatus: 'all' | 'solved' | 'unattempted' | 'bookmarked';
  onChangeStatus: (s: 'all' | 'solved' | 'unattempted' | 'bookmarked') => void;
  selectedCompany: string | 'all';
  onChangeCompany: (c: string | 'all') => void;
  activeModuleName?: string;
}

const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Intermediate: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  Advanced: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Expert: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  Staff: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
};

const TOP_COMPANIES = ['Meta', 'Google', 'Netflix', 'Amazon', 'Apple', 'Stripe', 'Uber', 'Airbnb'];

export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  activeProblemId,
  onSelectProblem,
  progress,
  onToggleSolved,
  onToggleBookmark,
  selectedDifficulty,
  onChangeDifficulty,
  selectedStatus,
  onChangeStatus,
  selectedCompany,
  onChangeCompany,
  activeModuleName,
}) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 w-full lg:w-[420px] flex-shrink-0">
      {/* Filter and stats header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/60 backdrop-blur-sm space-y-2.5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {activeModuleName ? activeModuleName : 'Catalog'}
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {problems.length} challenges
          </span>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          {(['all', 'unattempted', 'solved', 'bookmarked'] as const).map(s => (
            <button
              key={s}
              onClick={() => onChangeStatus(s)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition ${
                selectedStatus === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Difficulty Select */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          {(['all', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Staff'] as const).map(d => (
            <button
              key={d}
              onClick={() => onChangeDifficulty(d)}
              className={`px-2 py-0.5 rounded border transition whitespace-nowrap ${
                selectedDifficulty === d
                  ? 'bg-slate-700 text-white border-slate-500'
                  : 'border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Company Quick filter */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <Building2 className="w-3 h-3 text-slate-500" />
          <select 
            value={selectedCompany}
            onChange={e => onChangeCompany(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-slate-300 text-[11px] focus:outline-none"
          >
            <option value="all">All Companies (FAANG+)</option>
            {TOP_COMPANIES.map(comp => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Problem list scroll area */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
        {problems.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            <p>No problems found matching this filter criteria.</p>
            <button 
              onClick={() => {
                onChangeDifficulty('all');
                onChangeStatus('all');
                onChangeCompany('all');
              }}
              className="mt-3 text-indigo-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          problems.map(problem => {
            const isSolved = progress.completedProblemIds.includes(problem.id);
            const isBookmarked = progress.bookmarkedProblemIds.includes(problem.id);
            const isActive = problem.id === activeProblemId;

            return (
              <div
                key={problem.id}
                onClick={() => onSelectProblem(problem.id)}
                className={`p-3.5 transition cursor-pointer text-xs relative group ${
                  isActive
                    ? 'bg-indigo-950/60 border-l-4 border-l-indigo-500'
                    : 'hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {/* Solved check toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSolved(problem.id);
                    }}
                    className="mt-0.5 text-slate-500 hover:text-emerald-400 transition"
                    title={isSolved ? 'Mark as unsolved' : 'Mark as solved'}
                  >
                    {isSolved ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 fill-emerald-500/20" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-600 hover:text-slate-400" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-mono text-slate-400 text-[11px] font-semibold">
                        #{problem.id}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                        {problem.difficulty}
                      </span>
                      {problem.companies && problem.companies[0] && (
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded font-medium">
                          {problem.companies[0]}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 ml-auto">
                        <Clock className="w-2.5 h-2.5" />
                        {problem.timeEstimate}
                      </span>
                    </div>

                    <h4 className={`font-semibold text-xs leading-snug line-clamp-1 ${
                      isActive ? 'text-indigo-200' : isSolved ? 'text-slate-300' : 'text-white'
                    }`}>
                      {problem.title}
                    </h4>

                    <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {problem.summary}
                    </p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {problem.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-slate-800/80 text-slate-400 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bookmark toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(problem.id);
                    }}
                    className={`mt-0.5 p-1 rounded hover:bg-slate-800 transition ${
                      isBookmarked ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'
                    }`}
                    title={isBookmarked ? 'Remove bookmark' : 'Bookmark for review'}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400' : ''}`} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
