import { UserProgress } from '../types/problem';

const STORAGE_KEY = 'react_1000_user_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  completedProblemIds: [1, 92], // Seed with 2 solved as helpful kickstarter example
  bookmarkedProblemIds: [184, 368, 880],
  userDrafts: {},
  userNotes: {},
  solvedAt: {
    1: new Date().toISOString(),
    92: new Date().toISOString(),
  },
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
    };
  } catch (e) {
    console.error('Failed to parse user progress from localStorage', e);
    return DEFAULT_PROGRESS;
  }
}

export function saveUserProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Failed to save user progress to localStorage', e);
  }
}
