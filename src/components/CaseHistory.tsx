import { CaseFile } from '@/types/bug';
import { Button } from '@/components/ui/button';
import { SeverityBadge } from '@/components/SeverityBadge';
import { 
  X, 
  Trash2, 
  FolderOpen, 
  Calendar,
  Code,
  CheckCircle,
  Archive,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface CaseHistoryProps {
  cases: CaseFile[];
  onClose: () => void;
  onSelectCase: (caseFile: CaseFile) => void;
  onDeleteCase: (id: string) => void;
}

const STATUS_CONFIG = {
  open: { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10' },
  resolved: { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10' },
  archived: { icon: Archive, color: 'text-muted-foreground', bg: 'bg-muted' },
};

export function CaseHistory({ cases, onClose, onSelectCase, onDeleteCase }: CaseHistoryProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative h-full w-full max-w-lg bg-card border-l border-border shadow-2xl animate-slide-in-right overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <FolderOpen className="w-6 h-6 text-primary" />
              <div>
                <h2 className="text-xl font-bold">Case Files</h2>
                <p className="text-sm text-muted-foreground">
                  {cases.length} autopsy {cases.length === 1 ? 'report' : 'reports'}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Cases list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cases.length === 0 ? (
              <div className="text-center py-12">
                <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">No case files yet</p>
                <p className="text-sm text-muted-foreground/70">
                  Analyze a bug to create your first case
                </p>
              </div>
            ) : (
              cases.map((caseFile) => {
                const statusConfig = STATUS_CONFIG[caseFile.status];
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={caseFile.id}
                    className="case-card group cursor-pointer"
                    onClick={() => onSelectCase(caseFile)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium',
                            statusConfig.bg,
                            statusConfig.color
                          )}>
                            <StatusIcon className="w-3 h-3" />
                            {caseFile.status}
                          </span>
                          <SeverityBadge score={caseFile.analysis.severityScore} size="sm" showLabel={false} />
                        </div>
                        
                        <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {caseFile.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                          {caseFile.analysis.rootCause}
                        </p>

                        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Code className="w-3 h-3" />
                            {caseFile.analysis.language}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDistanceToNow(caseFile.createdAt, { addSuffix: true })}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCase(caseFile.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
