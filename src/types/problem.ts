export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Staff';

export type ProblemStatus = 'unattempted' | 'attempted' | 'solved';

export interface TestCase {
  id: string;
  name: string;
  description: string;
  // Test code that will be evaluated against the rendered component or hook
  assertionCode: string;
}

export interface Problem {
  id: number;
  title: string;
  moduleId: string;
  moduleName: string;
  difficulty: Difficulty;
  timeEstimate: string; // e.g. "15 min"
  tags: string[];
  companies?: string[]; // e.g. ["Meta", "Google", "Stripe"]
  summary: string;
  requirements: string[];
  mentalModelTakeaway: string;
  starterCode: string;
  solutionCode: string;
  explanation: string;
  pitfalls: string[];
  hints: string[];
  testCases?: TestCase[];
  interviewFollowUps?: string[];
}

export interface ModuleDefinition {
  id: string;
  title: string;
  shortDescription: string;
  iconName: string;
  category: 'Foundation' | 'Hooks & Core' | 'Architecture & Patterns' | 'Modern React & Concurrency' | 'Production & Systems' | 'Interviews';
  level: string;
  problemRange: [number, number];
  color: string;
}

export interface UserProgress {
  completedProblemIds: number[];
  bookmarkedProblemIds: number[];
  userDrafts: Record<number, string>; // problemId -> code
  userNotes: Record<number, string>; // problemId -> notes
  solvedAt: Record<number, string>; // problemId -> ISO date string
  streakDays: number;
  lastActiveDate: string;
}

export interface FilterOptions {
  searchQuery: string;
  selectedModule: string | 'all';
  selectedDifficulty: Difficulty | 'all';
  selectedStatus: 'all' | 'solved' | 'unattempted' | 'bookmarked';
  selectedTag: string | 'all';
  selectedCompany: string | 'all';
  onlyInterviewFavorites: boolean;
}
