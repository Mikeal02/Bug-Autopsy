export const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'cpp', label: 'C++' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'sql', label: 'SQL' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'shell', label: 'Shell/Bash' },
  { value: 'other', label: 'Other' },
] as const;

export const FRAMEWORKS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'nextjs', label: 'Next.js' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'node', label: 'Node.js' },
  { value: 'express', label: 'Express' },
  { value: 'django', label: 'Django' },
  { value: 'flask', label: 'Flask' },
  { value: 'fastapi', label: 'FastAPI' },
  { value: 'spring', label: 'Spring Boot' },
  { value: 'rails', label: 'Ruby on Rails' },
  { value: 'laravel', label: 'Laravel' },
  { value: 'dotnet', label: '.NET' },
  { value: 'none', label: 'None / Vanilla' },
] as const;

export function detectLanguage(code: string): string {
  // Simple heuristics for language detection
  if (code.includes('import React') || code.includes('useState') || code.includes('useEffect')) {
    return 'typescript';
  }
  if (code.includes('def ') && code.includes(':') && !code.includes('{')) {
    return 'python';
  }
  if (code.includes('public class') || code.includes('public static void main')) {
    return 'java';
  }
  if (code.includes('func ') && code.includes('package ')) {
    return 'go';
  }
  if (code.includes('fn ') && code.includes('let mut')) {
    return 'rust';
  }
  if (code.includes('<?php')) {
    return 'php';
  }
  if (code.includes('puts ') || code.includes('def ') && code.includes('end')) {
    return 'ruby';
  }
  if (code.includes('const ') || code.includes('let ') || code.includes('var ') || code.includes('function ')) {
    return 'javascript';
  }
  return 'other';
}
