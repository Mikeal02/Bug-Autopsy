import { CaseFile } from '@/types/bug';

const STORAGE_KEY = 'bug-autopsy-cases';

export function getCases(): CaseFile[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const cases = JSON.parse(stored);
    return cases.map((c: any) => ({
      ...c,
      createdAt: new Date(c.createdAt),
      updatedAt: new Date(c.updatedAt),
      analysis: {
        ...c.analysis,
        createdAt: new Date(c.analysis.createdAt),
      },
    }));
  } catch {
    return [];
  }
}

export function saveCase(caseFile: CaseFile): void {
  const cases = getCases();
  const existingIndex = cases.findIndex(c => c.id === caseFile.id);
  
  if (existingIndex >= 0) {
    cases[existingIndex] = caseFile;
  } else {
    cases.unshift(caseFile);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export function deleteCase(id: string): void {
  const cases = getCases().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
}

export function getCase(id: string): CaseFile | undefined {
  return getCases().find(c => c.id === id);
}
