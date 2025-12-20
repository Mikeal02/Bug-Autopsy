import { useState } from 'react';
import { BugAnalysis, ExplanationMode } from '@/types/bug';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/CodeBlock';
import { SeverityBadge, SeverityMeter } from '@/components/SeverityBadge';
import { ExportButton } from '@/components/ExportButton';
import { 
  AlertTriangle, 
  Target, 
  Lightbulb, 
  Wrench, 
  Code, 
  Shield, 
  Copy, 
  Check,
  Baby,
  User,
  GraduationCap,
  Briefcase,
  Tag,
  AlertCircle,
  Zap,
  Database,
  Globe,
  Lock,
  RefreshCw,
  Save
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface AnalysisResultsProps {
  analysis: BugAnalysis;
  onSaveCase: () => void;
}

const MODE_CONFIG: Record<ExplanationMode, { label: string; icon: React.ElementType; description: string }> = {
  eli5: { label: 'ELI5', icon: Baby, description: 'Explain Like I\'m 5' },
  standard: { label: 'Standard', icon: User, description: 'Regular explanation' },
  senior: { label: 'Senior', icon: GraduationCap, description: 'Technical deep-dive' },
  interview: { label: 'Interview', icon: Briefcase, description: 'Interview-ready answer' },
};

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  logic: Lightbulb,
  network: Globe,
  ui: RefreshCw,
  database: Database,
  security: Lock,
  syntax: Code,
  runtime: Zap,
  async: RefreshCw,
  memory: Database,
  dependency: Tag,
};

export function AnalysisResults({ analysis, onSaveCase }: AnalysisResultsProps) {
  const [explanationMode, setExplanationMode] = useState<ExplanationMode>('standard');
  const [copied, setCopied] = useState<string | null>(null);

  const getExplanation = () => {
    switch (explanationMode) {
      case 'eli5': return analysis.eli5Explanation;
      case 'senior': return analysis.seniorExplanation;
      case 'interview': return analysis.interviewExplanation;
      default: return analysis.humanExplanation;
    }
  };

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    toast({ title: 'Copied to clipboard!' });
    setTimeout(() => setCopied(null), 2000);
  };

  const CategoryIcon = CATEGORY_ICONS[analysis.category] || Tag;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with severity and save */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-card rounded-xl border border-border">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Autopsy Report</h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium',
              'bg-primary/10 text-primary'
            )}>
              <CategoryIcon className="w-4 h-4" />
              {analysis.category.charAt(0).toUpperCase() + analysis.category.slice(1)} Error
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-secondary text-secondary-foreground">
              {analysis.location.charAt(0).toUpperCase() + analysis.location.slice(1)}
            </span>
            {analysis.isDevOnly && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-warning/10 text-warning">
                Dev Only
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <SeverityBadge score={analysis.severityScore} size="lg" />
          <ExportButton analysis={analysis} />
          <Button variant="outline" onClick={onSaveCase}>
            <Save className="w-4 h-4 mr-2" />
            Save Case
          </Button>
        </div>
      </div>

      {/* Severity Meter */}
      <div className="analysis-section">
        <SeverityMeter score={analysis.severityScore} />
      </div>

      {/* Root Cause */}
      <div className="analysis-section">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-destructive" />
          <h3 className="text-lg font-semibold">Root Cause Analysis</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(analysis.rootCause, 'root')}
            className="ml-auto"
          >
            {copied === 'root' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        <p className="text-foreground leading-relaxed">{analysis.rootCause}</p>
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium text-muted-foreground">Error Type: </span>
          <span className="text-sm font-semibold text-foreground">{analysis.errorType}</span>
        </div>
      </div>

      {/* Failure Location */}
      {analysis.failureLine && (
        <div className="analysis-section">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="text-lg font-semibold">Failure Location</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">
                Line {analysis.failureLineNumber}: Error occurred here
              </p>
              <code className="font-mono text-sm text-destructive">{analysis.failureLine}</code>
            </div>
            {analysis.misleadingLine && (
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">
                  Line {analysis.misleadingLineNumber}: Misleading line (actual cause may be here)
                </p>
                <code className="font-mono text-sm text-warning">{analysis.misleadingLine}</code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Human Explanation with Mode Selector */}
      <div className="analysis-section">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Explanation</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(getExplanation(), 'explanation')}
            className="ml-auto"
          >
            {copied === 'explanation' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        
        {/* Mode selector */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.entries(MODE_CONFIG) as [ExplanationMode, typeof MODE_CONFIG[ExplanationMode]][]).map(([mode, config]) => {
            const Icon = config.icon;
            return (
              <Button
                key={mode}
                variant={explanationMode === mode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setExplanationMode(mode)}
                className="gap-2"
              >
                <Icon className="w-4 h-4" />
                {config.label}
              </Button>
            );
          })}
        </div>

        <p className="text-foreground leading-relaxed">{getExplanation()}</p>
      </div>

      {/* Fix Strategy */}
      <div className="analysis-section">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-5 h-5 text-success" />
          <h3 className="text-lg font-semibold">Fix Strategy</h3>
        </div>
        <ol className="space-y-3">
          {analysis.fixStrategy.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-success/20 text-success rounded-full text-sm font-bold">
                {i + 1}
              </span>
              <span className="text-foreground">{step}</span>
            </li>
          ))}
        </ol>
        
        {analysis.bestPractices.length > 0 && (
          <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="font-semibold text-primary mb-2">Best Practices</h4>
            <ul className="space-y-1">
              {analysis.bestPractices.map((practice, i) => (
                <li key={i} className="text-sm text-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {practice}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Fixed Code */}
      {analysis.fixedCode && (
        <div className="analysis-section">
          <div className="flex items-center gap-2 mb-4">
            <Code className="w-5 h-5 text-success" />
            <h3 className="text-lg font-semibold">Fixed Code</h3>
          </div>
          <CodeBlock
            code={analysis.fixedCode}
            language={analysis.language}
            title="fixed-code"
            successLines={[]}
          />
          
          {analysis.optimizedCode && (
            <div className="mt-4">
              <h4 className="font-medium text-muted-foreground mb-2">Optimized Version</h4>
              <CodeBlock
                code={analysis.optimizedCode}
                language={analysis.language}
                title="optimized-code"
              />
            </div>
          )}
        </div>
      )}

      {/* Production Risk */}
      <div className="analysis-section">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-destructive" />
          <h3 className="text-lg font-semibold">Production Risk Assessment</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'App Crash', value: analysis.productionRisk.canCrash },
            { label: 'Data Loss', value: analysis.productionRisk.canCauseDataLoss },
            { label: 'Security Breach', value: analysis.productionRisk.canCauseSecurityBreach },
            { label: 'Performance Issues', value: analysis.productionRisk.canCausePerformanceDegradation },
          ].map((risk) => (
            <div
              key={risk.label}
              className={cn(
                'p-3 rounded-lg border text-center',
                risk.value
                  ? 'bg-destructive/10 border-destructive/30 text-destructive'
                  : 'bg-success/10 border-success/30 text-success'
              )}
            >
              <AlertCircle className={cn('w-5 h-5 mx-auto mb-1', risk.value ? 'text-destructive' : 'text-success')} />
              <p className="text-xs font-medium">{risk.label}</p>
              <p className="text-sm font-bold">{risk.value ? 'Yes' : 'No'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Detection Tags */}
      <div className="analysis-section">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Advanced Detection</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.hasInfiniteLoop && (
            <span className="px-3 py-1 rounded-full text-sm bg-destructive/10 text-destructive">
              Infinite Loop Detected
            </span>
          )}
          {analysis.hasRaceCondition && (
            <span className="px-3 py-1 rounded-full text-sm bg-warning/10 text-warning">
              Race Condition
            </span>
          )}
          {analysis.hasNullError && (
            <span className="px-3 py-1 rounded-full text-sm bg-destructive/10 text-destructive">
              Null/Undefined Error
            </span>
          )}
          {analysis.hasMemoryLeak && (
            <span className="px-3 py-1 rounded-full text-sm bg-warning/10 text-warning">
              Memory Leak Risk
            </span>
          )}
          {analysis.hasBadApiHandling && (
            <span className="px-3 py-1 rounded-full text-sm bg-warning/10 text-warning">
              Poor API Handling
            </span>
          )}
          {analysis.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full text-sm bg-secondary text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
