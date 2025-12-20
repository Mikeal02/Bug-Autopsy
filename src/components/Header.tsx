import { Bug, Moon, Sun, History, Dna } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onShowHistory: () => void;
  caseCount: number;
}

export function Header({ isDarkMode, onToggleDarkMode, onShowHistory, caseCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl animate-pulse-glow" />
              <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl shadow-lg">
                <Dna className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Bug Autopsy
              </h1>
              <p className="text-xs text-muted-foreground">
                Forensic Debugging Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowHistory}
              className="relative"
            >
              <History className="w-4 h-4 mr-2" />
              Case Files
              {caseCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold bg-primary text-primary-foreground rounded-full">
                  {caseCount}
                </span>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="rounded-full"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
