import { useMemo, useState } from 'react';
import { Copy, Download, GitPullRequestDraft, Lightbulb } from 'lucide-react';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ReadinessReport } from '@/lib/types';
import { buildSuggestedReadinessFixPack } from '@/lib/readinessFixPack';

interface Props {
  report: ReadinessReport;
}

export function SuggestedReadinessFixPack({ report }: Props) {
  const files = useMemo(() => buildSuggestedReadinessFixPack(report), [report]);
  const [selectedPath, setSelectedPath] = useState(files[0]?.path || '');
  const selected = files.find(file => file.path === selectedPath) || files[0];
  const [copied, setCopied] = useState(false);

  const copySelected = async () => {
    if (!selected) return;
    await navigator.clipboard.writeText(selected.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <section className="glass rounded-2xl p-6 mb-8">
      <div className="flex flex-wrap items-start gap-3 mb-5">
        <Lightbulb className="h-4 w-4 text-accent mt-1" />
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-semibold">Suggested Readiness Fix Pack</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            ShipSeal can generate the missing repository files that improve agent-readiness, governance, testing and client handoff quality.
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            These files are already included in your Delivery Pack. Add them to your repository to improve future scans.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => downloadSuggestedFiles(report.repoName, files)}>
          <Download className="h-3.5 w-3.5 mr-1.5" /> Download suggested files
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.15fr] gap-4">
        <div className="space-y-2">
          {files.map(file => (
            <button
              key={file.path}
              type="button"
              onClick={() => setSelectedPath(file.path)}
              className={`w-full text-left rounded-lg border px-3 py-2 transition-colors ${selected?.path === file.path ? 'border-primary/50 bg-primary/10' : 'border-border/60 bg-secondary/25 hover:border-primary/30'}`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-foreground/90">{file.path}</span>
                {file.alreadyInDeliveryPack && <Badge variant="outline" className="ml-auto text-[10px] border-success/40 text-success">In Delivery Pack</Badge>}
              </div>
              <div className="text-xs text-muted-foreground mt-1">{file.readinessCategory}</div>
              <div className="text-[11px] text-muted-foreground/80 mt-1">{file.improves}</div>
            </button>
          ))}
        </div>

        <div className="rounded-lg border border-border/60 bg-secondary/25 p-4 min-w-0">
          {selected && (
            <>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="font-mono text-xs text-foreground/90">{selected.path}</div>
                <Badge variant="outline" className="border-border/70 text-[10px]">{selected.readinessCategory}</Badge>
                <Button type="button" variant="ghost" size="sm" onClick={copySelected} className="ml-auto">
                  <Copy className="h-3.5 w-3.5 mr-1.5" /> {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mb-3">{selected.whyUseful}</p>
              <pre className="max-h-72 overflow-auto rounded-md bg-[hsl(240_20%_4%)] p-3 text-[11px] leading-relaxed text-foreground/85">
                {selected.content}
              </pre>
            </>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-border/60 bg-secondary/20 p-4 flex flex-col md:flex-row md:items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="font-display text-sm font-semibold">Create Readiness PR - coming soon</div>
          <p className="text-xs text-muted-foreground mt-1">
            Future version: create a GitHub pull request with the suggested readiness files on a separate branch for review.
          </p>
        </div>
        <Button type="button" variant="outline" disabled>
          <GitPullRequestDraft className="h-3.5 w-3.5 mr-1.5" /> Create Readiness PR
        </Button>
      </div>
    </section>
  );
}

async function downloadSuggestedFiles(repoName: string, files: ReturnType<typeof buildSuggestedReadinessFixPack>) {
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.path, file.content);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `shipseal-readiness-fix-pack-${repoName}.zip`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 30000);
}
