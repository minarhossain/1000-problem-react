import React, { useState } from 'react';
import { Problem, UserProgress } from '../types/problem';
import { exportCurriculumAsMarkdown, downloadFile } from '../utils/exportMarkdown';
import { X, Download, FileText, Check, Copy, Code } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  problems: Problem[];
  progress: UserProgress;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  problems,
  progress,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleDownloadMarkdown = () => {
    const md = exportCurriculumAsMarkdown(problems, progress);
    downloadFile(md, 'react-1000-problems-curriculum.md', 'text/markdown');
  };

  const handleDownloadJSON = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      totalProblems: problems.length,
      userProgress: progress,
      problems: problems.map(p => ({
        id: p.id,
        title: p.title,
        module: p.moduleName,
        difficulty: p.difficulty,
        time: p.timeEstimate,
        tags: p.tags,
        companies: p.companies,
        summary: p.summary,
        requirements: p.requirements,
        mentalModel: p.mentalModelTakeaway,
      })),
    };
    downloadFile(JSON.stringify(data, null, 2), 'react-1000-problems.json', 'application/json');
  };

  const handleCopyMarkdown = () => {
    const md = exportCurriculumAsMarkdown(problems, progress);
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-white space-y-5">
        <div className="flex justify-between items-center pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold">Export 1,000 React Curriculum</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Export the entire 1,000 React problem curriculum including your completed marks, module groupings, tags, and acceptance requirements for offline study, Notion workspaces, or interview preparation.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleDownloadMarkdown}
            className="w-full p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition text-left group"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="font-semibold text-xs block text-white">Download Markdown (.md)</span>
                <span className="text-[11px] text-slate-400">Structured tables ready for Obsidian, GitHub, or Notion</span>
              </div>
            </div>
            <span className="text-xs text-indigo-400 font-semibold group-hover:translate-x-0.5 transition-transform">Download →</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="w-full p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition text-left group"
          >
            <div className="flex items-center gap-3">
              <Code className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="font-semibold text-xs block text-white">Download JSON (.json)</span>
                <span className="text-[11px] text-slate-400">Complete data schema and progress records</span>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform">Download →</span>
          </button>

          <button
            onClick={handleCopyMarkdown}
            className="w-full p-3.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition text-left"
          >
            <div className="flex items-center gap-3">
              {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5 text-amber-400" />}
              <div>
                <span className="font-semibold text-xs block text-white">Copy Markdown to Clipboard</span>
                <span className="text-[11px] text-slate-400">{copied ? 'Copied successfully!' : 'Directly paste into your notes app'}</span>
              </div>
            </div>
            <span className="text-xs text-amber-400 font-semibold">{copied ? '✓ Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-slate-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
