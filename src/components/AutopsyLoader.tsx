import { useState, useEffect } from 'react';
import { Dna, Search, Microscope, FileSearch, Brain, CheckCircle } from 'lucide-react';

const ANALYSIS_STEPS = [
  { icon: FileSearch, text: 'Parsing error signature...', duration: 800 },
  { icon: Search, text: 'Scanning stack trace...', duration: 1000 },
  { icon: Microscope, text: 'Analyzing code patterns...', duration: 1200 },
  { icon: Brain, text: 'Identifying root cause...', duration: 1500 },
  { icon: Dna, text: 'Generating fix strategy...', duration: 1000 },
  { icon: CheckCircle, text: 'Compiling autopsy report...', duration: 800 },
];

export function AutopsyLoader() {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (currentStep < ANALYSIS_STEPS.length) {
      timeout = setTimeout(() => {
        setCompletedSteps(prev => [...prev, currentStep]);
        setCurrentStep(prev => prev + 1);
      }, ANALYSIS_STEPS[currentStep].duration);
    }

    return () => clearTimeout(timeout);
  }, [currentStep]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <div className="w-full max-w-md p-8">
        {/* Main animation */}
        <div className="relative mb-8">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-24 h-24 flex items-center justify-center">
                <Dna className="w-12 h-12 text-primary animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              {/* Scanning line effect */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent animate-scan opacity-50" />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Performing Autopsy
          </h2>
          <p className="text-muted-foreground font-mono text-sm">
            Analyzing bug specimen...
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {ANALYSIS_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index;
            
            return (
              <div
                key={index}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  isCompleted
                    ? 'bg-success/10 text-success'
                    : isCurrent
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground opacity-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isCurrent ? 'animate-pulse' : ''}`} />
                <span className="font-mono text-sm flex-1">{step.text}</span>
                {isCompleted && (
                  <CheckCircle className="w-4 h-4 text-success animate-scale-in" />
                )}
                {isCurrent && (
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Terminal output effect */}
        <div className="mt-8 p-4 bg-terminal rounded-lg border border-border">
          <div className="font-mono text-xs text-terminal-text">
            <span className="text-primary">$</span> bug-autopsy --analyze --deep-scan
            <span className="animate-blink ml-1">▋</span>
          </div>
        </div>
      </div>
    </div>
  );
}
