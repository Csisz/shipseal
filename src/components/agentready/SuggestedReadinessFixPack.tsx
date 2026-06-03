import { useMemo, useState } from 'react';
import { Copy, Download, GitBranch, GitPullRequestDraft, Lightbulb, ShieldCheck } from 'lucide-react';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ReadinessReport } from '@/lib/types';
import { buildSuggestedReadinessFixPack } from '@/lib/readinessFixPack';
import { buildReadinessPrPlan } from '@/lib/readinessPr';

interface Props {
  report: ReadinessReport;
}

export function SuggestedReadinessFixPack({ report }: Props) {
  const files = useMemo(() => buildSuggestedReadinessFixPack(report), [report]);
  const [selectedPath, setSelectedPath] = useState(files[0]?.path || '');
  const selected = files.find(file => file.path === selectedPath) || files[0];
  const prPlan = useMemo(() => buildReadinessPrPlan(), []);
  const [copied, setCopied] = useState(false);
  const [copiedManualSteps, setCopiedManualSteps] = useState(false);

  const copySelected = async () => {
    if (!selected) return;
    await navigator.clipboard.writeText(selected.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  const copyManualSteps = async () => {
    await navigator.clipboard.writeText(`${prPlan.manualGitSteps}\n\n# Then open a Pull Request on GitHub.`);
    setCopiedManualSteps(true);
    window.setTimeout(() => setCopiedManualSteps(false), 1500);
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

      <div className="mt-5 rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="flex flex-wrap items-start gap-3 mb-4">
          <GitPullRequestDraft className="h-4 w-4 text-primary-glow mt-1" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display font-semibold">Create Readiness PR</h3>
              <Badge variant="outline" className="border-warning/50 text-warning">Coming soon</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Preview the repository changes ShipSeal would propose in a safe pull request.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              No GitHub write happens in this MVP. This is a preview only; a future version would create a separate branch and open a pull request for human review.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-4">
          <div className="space-y-3">
            <div className="rounded-lg border border-border/60 bg-secondary/25 p-4">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Planned PR</div>
              <InfoRow label="Branch name" value={prPlan.branchName} />
              <InfoRow label="PR title" value={prPlan.title} />
              <div className="mt-3 text-xs text-muted-foreground">{prPlan.summary}</div>
            </div>

            <div className="rounded-lg border border-border/60 bg-secondary/25 p-4">
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Readiness impact preview</div>
              <div className="flex flex-wrap gap-2">
                {prPlan.categories.map(category => (
                  <Badge key={category} variant="outline" className="border-border/70 text-[10px]">{category}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">{prPlan.expectedImpactNote}</p>
            </div>

            <div className="rounded-lg border border-warning/30 bg-warning/10 p-4">
              <div className="flex gap-2">
                <ShieldCheck className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <p className="text-xs text-warning">{prPlan.safetyNote}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-border/60 bg-secondary/25 p-4">
              <div className="flex items-center gap-2 mb-3">
                <GitBranch className="h-3.5 w-3.5 text-accent" />
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Changed files preview</div>
              </div>
              <div className="grid sm:grid-cols-2 gap-2">
                {prPlan.files.map(file => (
                  <div key={file.path} className="rounded-md border border-border/60 bg-background/30 px-3 py-2">
                    <div className="font-mono text-[11px] text-foreground/90 break-all">{file.path}</div>
                    <div className="text-[10px] text-muted-foreground mt-1">{file.readinessCategory}</div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Suggested files are included in your Delivery Pack. Add them to your repository to improve future scans.
              </p>
            </div>

            <div className="rounded-lg border border-border/60 bg-secondary/25 p-4">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Manual Git workflow fallback</div>
                <Button type="button" variant="ghost" size="sm" onClick={copyManualSteps} className="ml-auto">
                  <Copy className="h-3.5 w-3.5 mr-1.5" /> {copiedManualSteps ? 'Copied' : 'Copy manual Git steps'}
                </Button>
              </div>
              <pre className="max-h-56 overflow-auto rounded-md bg-[hsl(240_20%_4%)] p-3 text-[11px] leading-relaxed text-foreground/85">
                {prPlan.manualGitSteps}
              </pre>
              <p className="text-xs text-muted-foreground mt-3">Then open a Pull Request on GitHub.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="button" disabled className="bg-gradient-primary border-0 shadow-glow">
                <GitPullRequestDraft className="h-3.5 w-3.5 mr-1.5" /> Create Readiness PR — coming soon
              </Button>
              <Button type="button" variant="outline" onClick={copyManualSteps}>
                <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy manual Git steps
              </Button>
              <Button type="button" variant="outline" onClick={() => downloadSuggestedFiles(report.repoName, files)}>
                <Download className="h-3.5 w-3.5 mr-1.5" /> Download suggested files
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid sm:grid-cols-[120px_1fr] gap-1 py-1.5 text-xs">
      <div className="text-muted-foreground">{label}</div>
      <div className="font-mono text-foreground/90 break-all">{value}</div>
    </div>
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
