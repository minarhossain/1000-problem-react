import React from 'react';
import { UserProgress, Problem } from '../types/problem';
import { MODULES } from '../data/modules';
import { X, Award, CheckCircle2, TrendingUp, Zap, Target } from 'lucide-react';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  problems: Problem[];
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  progress,
  problems,
}) => {
  if (!isOpen) return null;

  const total = problems.length;
  const solved = progress.completedProblemIds.length;
  const percent = ((solved / total) * 100).toFixed(1);

  // Calculate difficulty distribution
  const diffCounts: Record<string, { total: number; solved: number }> = {
    Beginner: { total: 0, solved: 0 },
    Intermediate: { total: 0, solved: 0 },
    Advanced: { total: 0, solved: 0 },
    Expert: { total: 0, solved: 0 },
    Staff: { total: 0, solved: 0 },
  };

  problems.forEach(p => {
    if (diffCounts[p.difficulty]) {
      diffCounts[p.difficulty].total += 1;
      if (progress.completedProblemIds.includes(p.id)) {
        diffCounts[p.difficulty].solved += 1;
      }
    }
  });

  // Calculate readiness score
  const readinessScore = Math.min(100, Math.round(
    ((diffCounts.Beginner.solved * 1) + 
     (diffCounts.Intermediate.solved * 2) + 
     (diffCounts.Advanced.solved * 3) + 
     (diffCounts.Expert.solved * 4) + 
     (diffCounts.Staff.solved * 5)) / 25
  ));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">React 1,000 Mastery Analytics</h2>
              <p className="text-xs text-slate-400">Track your progression from Junior to Staff Architect</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Top Big KPI cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Total Solved</span>
              <div className="text-2xl font-bold font-mono text-emerald-400">
                {solved} <span className="text-xs text-slate-500">/ {total}</span>
              </div>
              <span className="text-[10px] text-slate-500">{percent}% of curriculum</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Interview Readiness</span>
              <div className="text-2xl font-bold font-mono text-indigo-400">
                {readinessScore}<span className="text-xs text-slate-500">/100</span>
              </div>
              <span className="text-[10px] text-indigo-400">FAANG Caliber</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Active Streak</span>
              <div className="text-2xl font-bold font-mono text-amber-400">
                {progress.streakDays} <span className="text-xs text-slate-500">days</span>
              </div>
              <span className="text-[10px] text-slate-500">Daily habit</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block mb-1">Bookmarked</span>
              <div className="text-2xl font-bold font-mono text-purple-400">
                {progress.bookmarkedProblemIds.length}
              </div>
              <span className="text-[10px] text-slate-500">For revision</span>
            </div>
          </div>

          {/* Difficulty breakdown */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">Difficulty Distribution</h3>
            <div className="space-y-2">
              {Object.entries(diffCounts).map(([tier, data]) => {
                const p = data.total > 0 ? Math.round((data.solved / data.total) * 100) : 0;
                return (
                  <div key={tier} className="space-y-1">
                    <div className="flex justify-between text-slate-300 text-[11px]">
                      <span className="font-semibold">{tier}</span>
                      <span className="font-mono text-slate-400">{data.solved} / {data.total} ({p}%)</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${p}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Module Breakdown */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">22 Pillars Completion</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MODULES.map(mod => {
                const [start, end] = mod.problemRange;
                const totalInMod = end - start + 1;
                const solvedInMod = progress.completedProblemIds.filter(id => id >= start && id <= end).length;
                const p = Math.round((solvedInMod / totalInMod) * 100);

                return (
                  <div key={mod.id} className="p-2.5 bg-slate-950 rounded-lg border border-slate-800/80">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-200 truncate">{mod.title}</span>
                      <span className="font-mono text-[10px] text-slate-400">{solvedInMod}/{totalInMod}</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${p}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-xs font-semibold text-white transition"
          >
            Back to Problems
          </button>
        </div>
      </div>
    </div>
  );
};
