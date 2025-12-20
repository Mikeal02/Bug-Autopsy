import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { LANGUAGES, FRAMEWORKS, detectLanguage } from '@/lib/languages';
import { Microscope, Code, AlertTriangle, Layers, Sparkles } from 'lucide-react';

interface BugInputFormProps {
  onSubmit: (data: {
    errorMessage: string;
    stackTrace: string;
    codeSnippet: string;
    language: string;
    framework: string;
  }) => void;
  isLoading: boolean;
}

export function BugInputForm({ onSubmit, isLoading }: BugInputFormProps) {
  const [errorMessage, setErrorMessage] = useState('');
  const [stackTrace, setStackTrace] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [language, setLanguage] = useState('');
  const [framework, setFramework] = useState('');

  const handleCodeChange = (value: string) => {
    setCodeSnippet(value);
    if (!language && value.length > 20) {
      const detected = detectLanguage(value);
      if (detected !== 'other') {
        setLanguage(detected);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!errorMessage.trim()) return;
    
    onSubmit({
      errorMessage,
      stackTrace,
      codeSnippet,
      language: language || 'javascript',
      framework,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Error Message */}
        <div className="space-y-2 lg:col-span-2">
          <Label htmlFor="error" className="flex items-center gap-2 text-base font-semibold">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            Error Message *
          </Label>
          <Textarea
            id="error"
            placeholder="Paste your error message here..."
            value={errorMessage}
            onChange={(e) => setErrorMessage(e.target.value)}
            className="min-h-[100px] font-mono text-sm bg-code border-border focus:border-primary resize-none"
            required
          />
        </div>

        {/* Stack Trace */}
        <div className="space-y-2">
          <Label htmlFor="stack" className="flex items-center gap-2 text-base font-semibold">
            <Layers className="w-4 h-4 text-warning" />
            Stack Trace
          </Label>
          <Textarea
            id="stack"
            placeholder="Paste the full stack trace (optional)..."
            value={stackTrace}
            onChange={(e) => setStackTrace(e.target.value)}
            className="min-h-[150px] font-mono text-xs bg-code border-border focus:border-primary resize-none"
          />
        </div>

        {/* Code Snippet */}
        <div className="space-y-2">
          <Label htmlFor="code" className="flex items-center gap-2 text-base font-semibold">
            <Code className="w-4 h-4 text-primary" />
            Code Snippet
          </Label>
          <Textarea
            id="code"
            placeholder="Paste the relevant code snippet (optional)..."
            value={codeSnippet}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="min-h-[150px] font-mono text-xs bg-code border-border focus:border-primary resize-none"
          />
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Programming Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Auto-detect or select..." />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {language && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {language === detectLanguage(codeSnippet) ? 'Auto-detected' : 'Selected'}
            </p>
          )}
        </div>

        {/* Framework Selection */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Framework (Optional)</Label>
          <Select value={framework} onValueChange={setFramework}>
            <SelectTrigger className="bg-background border-border">
              <SelectValue placeholder="Select framework..." />
            </SelectTrigger>
            <SelectContent>
              {FRAMEWORKS.map((fw) => (
                <SelectItem key={fw.value} value={fw.value}>
                  {fw.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        variant="autopsy"
        size="xl"
        className="w-full"
        disabled={!errorMessage.trim() || isLoading}
      >
        <Microscope className="w-5 h-5" />
        {isLoading ? 'Performing Autopsy...' : 'Begin Autopsy'}
      </Button>
    </form>
  );
}
