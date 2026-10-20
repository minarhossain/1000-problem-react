import React from 'react';
import { X, BookOpen, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { UserProgress } from '../types/problem';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRange: (startId: number, endId: number) => void;
  progress: UserProgress;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({
  isOpen,
  onClose,
  onSelectRange,
  progress,
}) => {
  if (!isOpen) return null;

  const tracks = [
    {
      title: 'Track 1: React Fundamentals & Core Hooks Fluency',
      range: [1, 320] as [number, number],
      level: 'Junior to Mid-Level Engineer',
      badge: 'Problems #1 - #320',
      description: 'Master JSX compilation, useState batching, deep immutability, modern useEffect synchronization, useRef DOM measurements, useMemo referential equality, useReducer state machines, and Context API architecture.',
      skills: ['Props & Slots', 'Immutability spreads', 'Race conditions', 'Cleanup patterns', 'Dependency arrays', 'useReducer patterns'],
      color: 'border-cyan-500/50 bg-cyan-950/20',
      accent: 'text-cyan-400',
    },
    {
      title: 'Track 2: The Senior Engineer: Hooks, Patterns & Resilient UI',
      range: [321, 665] as [number, number],
      level: 'Senior Engineer',
      badge: 'Problems #321 - #665',
      description: 'Build 40 production custom hooks from scratch (useDebounce, useIntersectionObserver, useStorage), master headless compound components, forms with complex schemas, Kanban boards, and TanStack Query optimistic server state.',
      skills: ['40 Custom Hooks', 'Compound Components', 'Optimistic UI', 'Error Boundaries', 'WAI-ARIA Accessibility', 'React.memo calibration'],
      color: 'border-indigo-500/50 bg-indigo-950/20',
      accent: 'text-indigo-400',
    },
    {
      title: 'Track 3: Staff Architect & FAANG Senior Interview Gauntlet',
      range: [666, 1000] as [number, number],
      level: 'Staff / Tech Lead',
      badge: 'Problems #666 - #1000',
      description: 'Conquer React 18/19 concurrency (useTransition, useDeferredValue, useOptimistic, Actions), hunt down 50 real production bugs (stale closures, memory leaks), design high-scale systems (Meta Newsfeed, Figma Canvas), and ace FAANG live coding drills.',
      skills: ['React 19 Actions', 'Stale Closure debugging', 'Infinite scroll virtualization', 'Off-thread Web Workers', 'System Design', 'Meta / Google live drills'],
      color: 'border-purple-500/50 bg-purple-950/20',
      accent: 'text-purple-400',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-white">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">1,000 Problem Mastery Roadmap</h2>
              <p className="text-xs text-slate-400">Structured progression to achieve true React Staff Engineer expertise</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {tracks.map((track, i) => {
            const [start, end] = track.range;
            const count = end - start + 1;
            const solved = progress.completedProblemIds.filter(id => id >= start && id <= end).length;
            const pct = Math.round((solved / count) * 100);

            return (
              <div 
                key={i}
                className={`p-5 rounded-xl border ${track.color} space-y-3 transition hover:border-slate-500`}
              >
                <div className="flex flex-wrap justify-between items-start gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-slate-900 border border-slate-700 ${track.accent}`}>
                        {track.badge}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Target: {track.level}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{track.title}</h3>
                  </div>

                  <button
                    onClick={() => {
                      onSelectRange(track.range[0], track.range[1]);
                      onClose();
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition"
                  >
                    <span>Practice Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-slate-300 leading-relaxed text-xs">
                  {track.description}
                </p>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Track Completion</span>
                    <span className="font-mono">{solved} / {count} solved ({pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {track.skills.map(s => (
                    <span key={s} className="px-2 py-0.5 bg-slate-900/80 border border-slate-800 text-slate-300 rounded text-[10px]">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300"
          >
            Close Roadmap
          </button>
        </div>
      </div>
    </div>
  );
};
