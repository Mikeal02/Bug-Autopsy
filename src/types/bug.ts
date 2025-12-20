export type BugCategory = 'logic' | 'network' | 'ui' | 'database' | 'security' | 'syntax' | 'runtime' | 'async' | 'memory' | 'dependency';

export type BugLocation = 'frontend' | 'backend' | 'fullstack' | 'unknown';

export type ExplanationMode = 'eli5' | 'standard' | 'senior' | 'interview';

export interface ProductionRisk {
  canCrash: boolean;
  canCauseDataLoss: boolean;
  canCauseSecurityBreach: boolean;
  canCausePerformanceDegradation: boolean;
}

export interface BugAnalysis {
  id: string;
  createdAt: Date;
  
  // Input
  errorMessage: string;
  stackTrace?: string;
  codeSnippet?: string;
  language: string;
  framework?: string;
  
  // Analysis Results
  rootCause: string;
  errorType: string;
  category: BugCategory;
  location: BugLocation;
  
  // Location Detection
  failureLineNumber?: number;
  failureLine?: string;
  misleadingLine?: string;
  misleadingLineNumber?: number;
  
  // Explanations
  humanExplanation: string;
  eli5Explanation: string;
  seniorExplanation: string;
  interviewExplanation: string;
  
  // Fix
  fixStrategy: string[];
  bestPractices: string[];
  fixedCode?: string;
  optimizedCode?: string;
  
  // Severity & Risk
  severityScore: number; // 1-10
  productionRisk: ProductionRisk;
  
  // Advanced Detection
  hasInfiniteLoop: boolean;
  hasRaceCondition: boolean;
  hasNullError: boolean;
  hasMemoryLeak: boolean;
  hasBadApiHandling: boolean;
  isDevOnly: boolean;
  
  // Tags
  tags: BugCategory[];
}

export interface CaseFile {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  analysis: BugAnalysis;
  notes?: string;
  status: 'open' | 'resolved' | 'archived';
}
// explaination level