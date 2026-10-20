import React from 'react';
import { MODULES } from '../data/modules';
import { UserProgress } from '../types/problem';
import { 
  Layers, 
  Database, 
  RefreshCw, 
  Target, 
  Zap, 
  Cpu, 
  Share2, 
  Anchor, 
  Sparkles, 
  Boxes, 
  CheckSquare, 
  LayoutGrid, 
  CloudDownload, 
  ShieldAlert, 
  Eye, 
  Film, 
  Bug, 
  CheckCircle2, 
  Network, 
  Award, 
  Server, 
  Gauge 
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Layers,
  Database,
  RefreshCw,
  Target,
  Zap,
  Cpu,
  Share2,
  Anchor,
  Sparkles,
  Boxes,
  CheckSquare,
  LayoutGrid,
  CloudDownload,
  ShieldAlert,
  Eye,
  Film,
  Bug,
  CheckCircle2,
  Network,
  Award,
  Server,
  Gauge,
};

interface ModuleSidebarProps {
  selectedModuleId: string | 'all';
  onSelectModule: (id: string | 'all') => void;
  progress: UserProgress;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const ModuleSidebar: React.FC<ModuleSidebarProps> = ({
  selectedModuleId,
  onSelectModule,
  progress,
  isMobileOpen,
  onCloseMobile,
}) => {
  const categories = [
    'Foundation',
    'Hooks & Core',
    'Architecture & Patterns',
    'Modern React & Concurrency',
    'Production & Systems',
    'Interviews',
  ] as const;

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside className={`
        fixed md:static top-0 bottom-0 left-0 z-40
        w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-full
        transition-transform duration-200 ease-in-out
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Curriculum Pillars</h2>
            <p className="text-xs font-semibold text-white">22 Structured Mastery Modules</p>
          </div>
          <button 
            onClick={() => onSelectModule('all')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
              selectedModuleId === 'all' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            All 1,000
          </button>
        </div>

        {/* Scrollable Module List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs">
          {categories.map((category) => {
            const mods = MODULES.filter(m => m.category === category);
            if (mods.length === 0) return null;

            return (
              <div key={category} className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 block">
                  {category}
                </span>

                <div className="space-y-1">
                  {mods.map((mod) => {
                    const isSelected = selectedModuleId === mod.id;
                    const IconComponent = ICON_MAP[mod.iconName] || Layers;
                    const [start, end] = mod.problemRange;
                    const totalInMod = end - start + 1;
                    
                    // Count completed in this module
                    const completedInMod = progress.completedProblemIds.filter(
                      id => id >= start && id <= end
                    ).length;

                    const percent = Math.round((completedInMod / totalInMod) * 100);

                    return (
                      <button
                        key={mod.id}
                        onClick={() => {
                          onSelectModule(mod.id);
                          onCloseMobile();
                        }}
                        className={`w-full text-left p-2.5 rounded-lg transition group flex items-start gap-2.5 ${
                          isSelected
                            ? 'bg-indigo-950/80 border border-indigo-500/60 text-white shadow-sm'
                            : 'hover:bg-slate-800/80 text-slate-300 border border-transparent'
                        }`}
                      >
                        <div className={`p-1.5 rounded-md mt-0.5 ${
                          isSelected 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                        }`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center gap-1">
                            <span className="font-semibold truncate text-xs text-white">
                              {mod.title}
                            </span>
                            <span className="text-[10px] text-slate-300 font-mono flex-shrink-0">
                              #{start}-{end}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {mod.shortDescription}
                          </p>

                          {/* Progress bar */}
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 transition-all duration-300"
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="text-[9px] font-mono text-slate-300">
                              {completedInMod}/{totalInMod}
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};
