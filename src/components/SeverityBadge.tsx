import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info, Skull } from 'lucide-react';

interface SeverityBadgeProps {
  score: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function SeverityBadge({ score, showLabel = true, size = 'md' }: SeverityBadgeProps) {
  const getSeverityLevel = () => {
    if (score <= 3) return { level: 'low', label: 'Low', icon: Info };
    if (score <= 5) return { level: 'medium', label: 'Medium', icon: AlertCircle };
    if (score <= 7) return { level: 'high', label: 'High', icon: AlertTriangle };
    return { level: 'critical', label: 'Critical', icon: Skull };
  };

  const { level, label, icon: Icon } = getSeverityLevel();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold',
        sizeClasses[size],
        {
          'bg-severity-low text-severity-low': level === 'low',
          'bg-severity-medium text-severity-medium': level === 'medium',
          'bg-severity-high text-severity-high': level === 'high',
          'bg-severity-critical text-severity-critical': level === 'critical',
        }
      )}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{label}</span>}
      <span className="font-bold">{score}/10</span>
    </div>
  );
}

export function SeverityMeter({ score }: { score: number }) {
  const segments = Array.from({ length: 10 }, (_, i) => i + 1);
  
  const getSegmentColor = (segmentNum: number) => {
    if (segmentNum > score) return 'bg-muted';
    if (segmentNum <= 3) return 'bg-severity-low';
    if (segmentNum <= 5) return 'bg-severity-medium';
    if (segmentNum <= 7) return 'bg-severity-high';
    return 'bg-severity-critical';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">Bug Severity</span>
        <SeverityBadge score={score} size="sm" />
      </div>
      <div className="flex gap-1">
        {segments.map((seg) => (
          <div
            key={seg}
            className={cn(
              'h-3 flex-1 rounded-sm transition-all duration-300',
              getSegmentColor(seg),
              seg <= score && 'shadow-sm'
            )}
            style={{
              animationDelay: `${seg * 50}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
