import React, { useState, useEffect, useMemo } from 'react';
import { ALL_PROBLEMS } from './data/problemsGenerator';
import { MODULES } from './data/modules';
import { Difficulty, UserProgress, Problem } from './types/problem';
import { loadUserProgress, saveUserProgress } from './utils/storage';
import { Header } from './components/Header';
import { ModuleSidebar } from './components/ModuleSidebar';
import { ProblemList } from './components/ProblemList';
import { ProblemDetail } from './components/ProblemDetail';
import { StatsModal } from './components/StatsModal';
import { ExportModal } from './components/ExportModal';
import { RoadmapModal } from './components/RoadmapModal';
import { Menu } from 'lucide-react';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(loadUserProgress);
  const [activeProblemId, setActiveProblemId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModuleId, setSelectedModuleId] = useState<string | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'solved' | 'unattempted' | 'bookmarked'>('all');
  const [selectedCompany, setSelectedCompany] = useState<string | 'all'>('all');
  
  // Modals & Navigation
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync progress to storage whenever it updates
  useEffect(() => {
    saveUserProgress(progress);
  }, [progress]);

  // Filter problems based on current selections
  const filteredProblems = useMemo(() => {
    let result = ALL_PROBLEMS;

    if (selectedModuleId !== 'all') {
      result = result.filter(p => p.moduleId === selectedModuleId);
    }

    if (selectedDifficulty !== 'all') {
      result = result.filter(p => p.difficulty === selectedDifficulty);
    }

    if (selectedCompany !== 'all') {
      result = result.filter(p => p.companies?.includes(selectedCompany));
    }

    if (selectedStatus === 'solved') {
      result = result.filter(p => progress.completedProblemIds.includes(p.id));
    } else if (selectedStatus === 'unattempted') {
      result = result.filter(p => !progress.completedProblemIds.includes(p.id));
    } else if (selectedStatus === 'bookmarked') {
      result = result.filter(p => progress.bookmarkedProblemIds.includes(p.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q)) ||
        p.summary.toLowerCase().includes(q) ||
        p.companies?.some(c => c.toLowerCase().includes(q)) ||
        `#${p.id}`.includes(q)
      );
    }

    return result;
  }, [selectedModuleId, selectedDifficulty, selectedCompany, selectedStatus, searchQuery, progress]);

  // Find active problem
  const activeProblem = useMemo(() => {
    const found = ALL_PROBLEMS.find(p => p.id === activeProblemId);
    return found || ALL_PROBLEMS[0];
  }, [activeProblemId]);

  // Current code draft for active problem
  const currentCode = progress.userDrafts[activeProblem.id] ?? activeProblem.starterCode;
  const currentNotes = progress.userNotes[activeProblem.id] ?? '';

  const handleCodeChange = (code: string) => {
    setProgress(prev => ({
      ...prev,
      userDrafts: {
        ...prev.userDrafts,
        [activeProblem.id]: code,
      },
    }));
  };

  const handleSaveNotes = (notes: string) => {
    setProgress(prev => ({
      ...prev,
      userNotes: {
        ...prev.userNotes,
        [activeProblem.id]: notes,
      },
    }));
  };

  const handleToggleSolved = (id: number) => {
    setProgress(prev => {
      const isAlready = prev.completedProblemIds.includes(id);
      const nextCompleted = isAlready 
        ? prev.completedProblemIds.filter(x => x !== id)
        : [...prev.completedProblemIds, id];
      
      const nextSolvedAt = { ...prev.solvedAt };
      if (!isAlready) {
        nextSolvedAt[id] = new Date().toISOString();
      } else {
        delete nextSolvedAt[id];
      }

      return {
        ...prev,
        completedProblemIds: nextCompleted,
        solvedAt: nextSolvedAt,
      };
    });
  };

  const handleToggleBookmark = (id: number) => {
    setProgress(prev => {
      const isAlready = prev.bookmarkedProblemIds.includes(id);
      return {
        ...prev,
        bookmarkedProblemIds: isAlready
          ? prev.bookmarkedProblemIds.filter(x => x !== id)
          : [...prev.bookmarkedProblemIds, id],
      };
    });
  };

  const handleNextProblem = () => {
    const currentIndex = filteredProblems.findIndex(p => p.id === activeProblem.id);
    if (currentIndex >= 0 && currentIndex < filteredProblems.length - 1) {
      setActiveProblemId(filteredProblems[currentIndex + 1].id);
    } else {
      setActiveProblemId(Math.min(1000, activeProblem.id + 1));
    }
  };

  const handlePrevProblem = () => {
    const currentIndex = filteredProblems.findIndex(p => p.id === activeProblem.id);
    if (currentIndex > 0) {
      setActiveProblemId(filteredProblems[currentIndex - 1].id);
    } else {
      setActiveProblemId(Math.max(1, activeProblem.id - 1));
    }
  };

  const handleRandomProblem = () => {
    const randomIndex = Math.floor(Math.random() * ALL_PROBLEMS.length);
    setActiveProblemId(ALL_PROBLEMS[randomIndex].id);
  };

  const handleDailyChallenge = () => {
    // Pick daily challenge deterministically based on day of year
    const now = new Date();
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    const dailyId = ((dayOfYear * 7) % ALL_PROBLEMS.length) + 1;
    setActiveProblemId(dailyId);
  };

  const handleSelectTrackRange = (startId: number, _endId: number) => {
    setSelectedModuleId('all');
    setSelectedDifficulty('all');
    setSelectedStatus('all');
    setSelectedCompany('all');
    setSearchQuery('');
    setActiveProblemId(startId);
  };

  const activeModule = MODULES.find(m => m.id === selectedModuleId);

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Global Top App Bar */}
      <Header
        progress={progress}
        totalProblems={ALL_PROBLEMS.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onRandomProblem={handleRandomProblem}
        onDailyChallenge={handleDailyChallenge}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
      />

      {/* Main 3-Column Studio Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden fixed bottom-4 right-4 z-30 p-3 bg-indigo-600 text-white rounded-full shadow-2xl border border-indigo-400"
          title="Open Pillars"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* 1. Leftmost: 22 Mastery Modules Sidebar */}
        <ModuleSidebar
          selectedModuleId={selectedModuleId}
          onSelectModule={setSelectedModuleId}
          progress={progress}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* 2. Middle: Searchable & Filterable Problem Catalog */}
        <ProblemList
          problems={filteredProblems}
          activeProblemId={activeProblem.id}
          onSelectProblem={setActiveProblemId}
          progress={progress}
          onToggleSolved={handleToggleSolved}
          onToggleBookmark={handleToggleBookmark}
          selectedDifficulty={selectedDifficulty}
          onChangeDifficulty={setSelectedDifficulty}
          selectedStatus={selectedStatus}
          onChangeStatus={setSelectedStatus}
          selectedCompany={selectedCompany}
          onChangeCompany={setSelectedCompany}
          activeModuleName={activeModule ? activeModule.title : 'All 1,000 Problems'}
        />

        {/* 3. Right: Active Problem Workspace & Deep Dive */}
        <ProblemDetail
          problem={activeProblem}
          progress={progress}
          onToggleSolved={handleToggleSolved}
          onToggleBookmark={handleToggleBookmark}
          userCode={currentCode}
          onCodeChange={handleCodeChange}
          userNotes={currentNotes}
          onSaveNotes={handleSaveNotes}
          onNextProblem={handleNextProblem}
          onPrevProblem={handlePrevProblem}
        />
      </div>

      {/* Modals */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        progress={progress}
        problems={ALL_PROBLEMS}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        problems={ALL_PROBLEMS}
        progress={progress}
      />

      <RoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
        onSelectRange={handleSelectTrackRange}
        progress={progress}
      />
    </div>
  );
}
