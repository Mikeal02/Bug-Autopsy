import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Loader2 } from 'lucide-react';
import { BugAnalysis } from '@/types/bug';
import { toast } from '@/hooks/use-toast';

interface ExportButtonProps {
  analysis: BugAnalysis;
}

export function ExportButton({ analysis }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const generatePDFContent = () => {
    const getSeverityLabel = (score: number) => {
      if (score <= 3) return 'Low';
      if (score <= 5) return 'Medium';
      if (score <= 7) return 'High';
      return 'Critical';
    };

    return `
      <html>
        <head>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 40px; 
              line-height: 1.6; 
              color: #1a1a2e; 
            }
            h1 { 
              color: #0d9488; 
              border-bottom: 3px solid #0d9488; 
              padding-bottom: 10px; 
            }
            h2 { 
              color: #334155; 
              margin-top: 30px; 
              border-left: 4px solid #0d9488; 
              padding-left: 12px; 
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              margin-bottom: 20px; 
            }
            .badge { 
              display: inline-block; 
              padding: 4px 12px; 
              border-radius: 20px; 
              font-size: 12px; 
              font-weight: bold; 
              margin-right: 8px; 
            }
            .severity-low { background: #dcfce7; color: #166534; }
            .severity-medium { background: #fef3c7; color: #92400e; }
            .severity-high { background: #fee2e2; color: #991b1b; }
            .severity-critical { background: #fecaca; color: #7f1d1d; }
            .code { 
              background: #1e293b; 
              color: #e2e8f0; 
              padding: 16px; 
              border-radius: 8px; 
              font-family: 'Consolas', monospace; 
              font-size: 13px; 
              overflow-x: auto; 
              white-space: pre-wrap; 
            }
            .step { 
              background: #f1f5f9; 
              padding: 12px 16px; 
              border-radius: 8px; 
              margin: 8px 0; 
            }
            .step-number { 
              display: inline-block; 
              width: 24px; 
              height: 24px; 
              background: #0d9488; 
              color: white; 
              border-radius: 50%; 
              text-align: center; 
              line-height: 24px; 
              margin-right: 10px; 
              font-weight: bold; 
            }
            .risk-grid { 
              display: grid; 
              grid-template-columns: 1fr 1fr; 
              gap: 12px; 
              margin-top: 12px; 
            }
            .risk-item { 
              padding: 12px; 
              border-radius: 8px; 
              text-align: center; 
            }
            .risk-yes { background: #fee2e2; color: #991b1b; }
            .risk-no { background: #dcfce7; color: #166534; }
            .meta { color: #64748b; font-size: 14px; }
            .tag { 
              display: inline-block; 
              background: #e2e8f0; 
              padding: 2px 10px; 
              border-radius: 12px; 
              font-size: 12px; 
              margin: 2px; 
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔬 Bug Autopsy Report</h1>
          </div>
          
          <p class="meta">
            Generated: ${new Date().toLocaleString()} | 
            Language: ${analysis.language} | 
            ${analysis.framework ? `Framework: ${analysis.framework}` : ''}
          </p>
          
          <span class="badge severity-${getSeverityLabel(analysis.severityScore).toLowerCase()}">
            Severity: ${analysis.severityScore}/10 (${getSeverityLabel(analysis.severityScore)})
          </span>
          <span class="badge" style="background: #e0e7ff; color: #3730a3;">
            ${analysis.category.toUpperCase()}
          </span>
          <span class="badge" style="background: #f3e8ff; color: #7c3aed;">
            ${analysis.location.toUpperCase()}
          </span>

          <h2>🎯 Root Cause Analysis</h2>
          <p>${analysis.rootCause}</p>
          <p><strong>Error Type:</strong> ${analysis.errorType}</p>

          ${analysis.failureLine ? `
            <h2>⚠️ Failure Location</h2>
            <p><strong>Line ${analysis.failureLineNumber}:</strong></p>
            <div class="code">${analysis.failureLine}</div>
            ${analysis.misleadingLine ? `
              <p style="margin-top: 12px;"><strong>Misleading Line (${analysis.misleadingLineNumber}):</strong></p>
              <div class="code">${analysis.misleadingLine}</div>
            ` : ''}
          ` : ''}

          <h2>💡 Human Explanation</h2>
          <p>${analysis.humanExplanation}</p>

          <h2>🔧 Fix Strategy</h2>
          ${analysis.fixStrategy.map((step, i) => `
            <div class="step">
              <span class="step-number">${i + 1}</span>
              ${step}
            </div>
          `).join('')}

          ${analysis.bestPractices.length > 0 ? `
            <h2>✨ Best Practices</h2>
            <ul>
              ${analysis.bestPractices.map(p => `<li>${p}</li>`).join('')}
            </ul>
          ` : ''}

          ${analysis.fixedCode ? `
            <h2>✅ Fixed Code</h2>
            <div class="code">${analysis.fixedCode}</div>
          ` : ''}

          ${analysis.optimizedCode ? `
            <h2>🚀 Optimized Version</h2>
            <div class="code">${analysis.optimizedCode}</div>
          ` : ''}

          <h2>🛡️ Production Risk Assessment</h2>
          <div class="risk-grid">
            <div class="risk-item ${analysis.productionRisk.canCrash ? 'risk-yes' : 'risk-no'}">
              App Crash: ${analysis.productionRisk.canCrash ? 'Yes' : 'No'}
            </div>
            <div class="risk-item ${analysis.productionRisk.canCauseDataLoss ? 'risk-yes' : 'risk-no'}">
              Data Loss: ${analysis.productionRisk.canCauseDataLoss ? 'Yes' : 'No'}
            </div>
            <div class="risk-item ${analysis.productionRisk.canCauseSecurityBreach ? 'risk-yes' : 'risk-no'}">
              Security Breach: ${analysis.productionRisk.canCauseSecurityBreach ? 'Yes' : 'No'}
            </div>
            <div class="risk-item ${analysis.productionRisk.canCausePerformanceDegradation ? 'risk-yes' : 'risk-no'}">
              Performance Issues: ${analysis.productionRisk.canCausePerformanceDegradation ? 'Yes' : 'No'}
            </div>
          </div>

          <h2>🏷️ Tags</h2>
          ${analysis.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}
          ${analysis.hasNullError ? '<span class="tag">Null Error</span>' : ''}
          ${analysis.hasRaceCondition ? '<span class="tag">Race Condition</span>' : ''}
          ${analysis.hasInfiniteLoop ? '<span class="tag">Infinite Loop</span>' : ''}
          ${analysis.hasMemoryLeak ? '<span class="tag">Memory Leak</span>' : ''}

          <hr style="margin-top: 40px; border: none; border-top: 1px solid #e2e8f0;" />
          <p class="meta" style="text-align: center;">
            Generated by Bug Autopsy — AI-Powered Forensic Debugging
          </p>
        </body>
      </html>
    `;
  };

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = document.createElement('div');
      element.innerHTML = generatePDFContent();
      
      const opt = {
        margin: 0.5,
        filename: `bug-autopsy-${analysis.id.slice(0, 8)}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
      
      toast({
        title: 'PDF Exported',
        description: 'Bug report has been downloaded.',
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to generate PDF report.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      disabled={isExporting}
    >
      {isExporting ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <FileText className="w-4 h-4 mr-2" />
      )}
      Export PDF
    </Button>
  );
}
