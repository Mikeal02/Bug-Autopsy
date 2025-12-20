import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BugInputForm } from '@/components/BugInputForm';
import { AnalysisResults } from '@/components/AnalysisResults';
import { AutopsyLoader } from '@/components/AutopsyLoader';
import { CaseHistory } from '@/components/CaseHistory';
import { BugAnalysis, CaseFile } from '@/types/bug';
import { getCases, saveCase, deleteCase } from '@/lib/storage';
import { supabase } from '@/integrations/supabase/client';
import { Dna, Terminal, FileSearch, Target, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Index() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [cases, setCases] = useState<CaseFile[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<BugAnalysis | null>(null);

  useEffect(() => {
    setCases(getCases());
    document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSubmit = async (data: {
    errorMessage: string;
    stackTrace: string;
    codeSnippet: string;
    language: string;
    framework: string;
  }) => {
    setIsLoading(true);
    setCurrentAnalysis(null);

    try {
      const { data: responseData, error } = await supabase.functions.invoke('analyze-bug', {
        body: {
          errorMessage: data.errorMessage,
          stackTrace: data.stackTrace || undefined,
          codeSnippet: data.codeSnippet || undefined,
          language: data.language,
          framework: data.framework || undefined,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (responseData?.error) {
        throw new Error(responseData.error);
      }

      const analysis: BugAnalysis = {
        id: crypto.randomUUID(),
        createdAt: new Date(),
        errorMessage: data.errorMessage,
        stackTrace: data.stackTrace || undefined,
        codeSnippet: data.codeSnippet || undefined,
        language: data.language,
        framework: data.framework || undefined,
        ...responseData.analysis,
      };

      setCurrentAnalysis(analysis);

      toast({
        title: 'Autopsy Complete',
        description: 'Bug analysis has been generated.',
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Analysis Failed',
        description: error instanceof Error ? error.message : 'Failed to analyze the bug.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCase = () => {
    if (!currentAnalysis) return;

    const caseFile: CaseFile = {
      id: currentAnalysis.id,
      title: `${currentAnalysis.errorType} in ${currentAnalysis.language}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      analysis: currentAnalysis,
      status: 'open',
    };

    saveCase(caseFile);
    setCases(getCases());

    toast({
      title: 'Case Saved',
      description: 'Bug autopsy has been saved to your case files.',
    });
  };

  const handleDeleteCase = (id: string) => {
    deleteCase(id);
    setCases(getCases());
    toast({
      title: 'Case Deleted',
      description: 'The case file has been removed.',
    });
  };

  const handleSelectCase = (caseFile: CaseFile) => {
    setCurrentAnalysis(caseFile.analysis);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onShowHistory={() => setShowHistory(true)}
        caseCount={cases.length}
      />

      {isLoading && <AutopsyLoader />}

      <main className="container mx-auto px-4 py-8">
        {!currentAnalysis ? (
          <div className="max-w-4xl mx-auto">
            {/* Hero section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Dna className="w-4 h-4" />
                AI-Powered Bug Forensics
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Dissect Your Bugs with
                <span className="text-primary"> Precision</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Paste your error, and let our forensic AI perform a complete autopsy — 
                uncovering root causes, failure points, and actionable fixes.
              </p>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {[
                { icon: Target, label: 'Root Cause Analysis', color: 'text-destructive' },
                { icon: FileSearch, label: 'Failure Detection', color: 'text-warning' },
                { icon: Terminal, label: 'Fix Strategies', color: 'text-success' },
                { icon: Shield, label: 'Risk Assessment', color: 'text-primary' },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-border"
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  <span className="text-sm font-medium text-center">{feature.label}</span>
                </div>
              ))}
            </div>

            {/* Input form */}
            <div className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-xl">
              <BugInputForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setCurrentAnalysis(null)}
              className="mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Start New Autopsy
            </button>
            <AnalysisResults analysis={currentAnalysis} onSaveCase={handleSaveCase} />
          </div>
        )}
      </main>

      {showHistory && (
        <CaseHistory
          cases={cases}
          onClose={() => setShowHistory(false)}
          onSelectCase={handleSelectCase}
          onDeleteCase={handleDeleteCase}
        />
      )}
    </div>
  );
}
