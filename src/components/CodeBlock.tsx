import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  highlightLines?: number[];
  errorLines?: number[];
  successLines?: number[];
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = 'javascript',
  title,
  highlightLines = [],
  errorLines = [],
  successLines = [],
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split('\n');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'Code copied to clipboard',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fixed-code.${language}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: 'Downloaded!',
      description: 'Code file downloaded',
    });
  };

  return (
    <div className="terminal-window overflow-hidden">
      {/* Header */}
      <div className="terminal-header">
        <div className="flex gap-1.5">
          <div className="terminal-dot bg-destructive" />
          <div className="terminal-dot bg-warning" />
          <div className="terminal-dot bg-success" />
        </div>
        {title && (
          <span className="ml-3 text-sm text-muted-foreground font-mono">{title}</span>
        )}
        <div className="ml-auto flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="h-7 px-2 text-muted-foreground hover:text-foreground"
          >
            <Download className="w-3.5 h-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-muted-foreground hover:text-foreground"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Code content */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm">
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const isError = errorLines.includes(lineNum);
            const isSuccess = successLines.includes(lineNum);
            const isHighlight = highlightLines.includes(lineNum);

            return (
              <div
                key={i}
                className={cn(
                  'flex',
                  isError && 'error-line',
                  isSuccess && 'success-line',
                  isHighlight && 'bg-primary/10'
                )}
              >
                {showLineNumbers && (
                  <span className="select-none pr-4 text-muted-foreground/50 w-8 text-right">
                    {lineNum}
                  </span>
                )}
                <code className={cn(
                  'flex-1 text-terminal-text',
                  isError && 'text-destructive',
                  isSuccess && 'text-success'
                )}>
                  {line || ' '}
                </code>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
