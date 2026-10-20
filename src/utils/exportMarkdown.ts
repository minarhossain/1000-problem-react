import { Problem, UserProgress } from '../types/problem';
import { MODULES } from '../data/modules';

export function exportCurriculumAsMarkdown(problems: Problem[], progress: UserProgress): string {
  let md = `# React 1,000 Problems: The Ultimate Mastery Roadmap\n\n`;
  md += `> Exported from React 1000 Master Platform on ${new Date().toLocaleDateString()}\n`;
  md += `> Total Problems: ${problems.length} | Completed: ${progress.completedProblemIds.length} | Bookmarked: ${progress.bookmarkedProblemIds.length}\n\n`;

  for (const mod of MODULES) {
    const modProblems = problems.filter(p => p.moduleId === mod.id);
    const solvedInMod = modProblems.filter(p => progress.completedProblemIds.includes(p.id)).length;

    md += `## ${mod.title}\n`;
    md += `*${mod.shortDescription}*\n`;
    md += `**Progress:** ${solvedInMod}/${modProblems.length} completed (${Math.round((solvedInMod / modProblems.length) * 100)}%)\n\n`;
    md += `| ID | Problem Title | Difficulty | Est. Time | Tags | Status |\n`;
    md += `|---|---|---|---|---|---|\n`;

    for (const p of modProblems) {
      const isSolved = progress.completedProblemIds.includes(p.id) ? '✅ Solved' : '⬜ Incomplete';
      md += `| #${p.id} | **${p.title}** | \`${p.difficulty}\` | ${p.timeEstimate} | ${p.tags.slice(0, 3).join(', ')} | ${isSolved} |\n`;
    }
    md += `\n---\n\n`;
  }

  return md;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
