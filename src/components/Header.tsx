import React from 'react';
import { 
  Flame, 
  CheckCircle2, 
  Shuffle, 
  BarChart3, 
  Download, 
  Search,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { UserProgress } from '../types/problem';

interface HeaderProps {
  progress: UserProgress;
  totalProblems: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenStats: () => void;
  onOpenExport: () => void;
  onRandomProblem: () => void;
  onDailyChallenge: () => void;
  onOpenRoadmap: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress,
  totalProblems,
  searchQuery,
  onSearchChange,
  onOpenStats,
  onOpenExport,
  onRandomProblem,
  onDailyChallenge,
  onOpenRoadmap,
}) => {
  const solvedCount = progress.completedProblemIds.length;
  const percent = ((solvedCount / totalProblems) * 100).toFixed(1);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-lg">
            ⚛
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">React 1000</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                Staff Mastery
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">1,000 Structured Problems from Fundamentals to Senior Systems</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-2 min-w-[200px]">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input 
              type="text"
              placeholder="Search 1,000 problems by concept, hook, or company..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-950/80 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-white text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions & Stats */}
        <div className="flex items-center gap-2 text-xs">
          {/* Daily & Random */}
          <button
            onClick={onDailyChallenge}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-600/30 transition font-medium"
            title="Pick today's curated challenge"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Daily Pick</span>
          </button>

          <button
            onClick={onRandomProblem}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            title="Random Challenge"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Random</span>
          </button>

          {/* Streak */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{progress.streakDays}d</span>
          </div>

          {/* Solved Progress Counter */}
          <button
            onClick={onOpenStats}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono font-bold text-white">{solvedCount}</span>
            <span className="text-slate-400">/ {totalProblems}</span>
            <span className="text-[10px] text-emerald-400 font-mono hidden sm:inline">({percent}%)</span>
          </button>

          {/* Roadmap & Export */}
          <button
            onClick={onOpenRoadmap}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="View 22-Module Roadmap"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenStats}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Mastery Analytics"
          >
            <BarChart3 className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenExport}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            title="Export 1,000 Problems (Markdown / JSON)"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
