import {
  ArrowRight,
  BookCheck,
  FileArchive,
  FileCheck2,
  FileText,
  Gauge,
  GitBranch,
  Lock,
  Scale,
  ServerCog,
  Shield,
  ShieldCheck,
  Sparkles,
  Upload,
  Workflow,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { appVersion } from '@/lib/version';
import { ScoreGauge } from './ScoreGauge';
import { ReadinessBadge } from './ReadinessBadge';

interface Props {
  onSampleReport: () => void;
  onScrollScan: () => void;
}

export function Landing({ onSampleReport, onScrollScan }: Props) {
  return (
    <>
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="container relative grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs mb-6">
              <Sparkles className="h-3 w-3 text-primary-glow" />
              <span className="text-muted-foreground">AI Project Delivery Pack Generator. Deterministic scoring. No code execution.</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Generate the <span className="text-gradient">AI project delivery pack</span> your repo needs.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              ShipSeal scans a repository ZIP or public GitHub repo, explains the handoff readiness score, flags delivery risks, and exports a client-ready Delivery Pack.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={onScrollScan} className="bg-gradient-primary border-0 shadow-glow hover:opacity-90">
                Scan your repository <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={onSampleReport} className="border-border/80">
                View sample report
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Lock className="h-3 w-3" /> No code execution</span>
              <span className="inline-flex items-center gap-1.5"><Zap className="h-3 w-3" /> Runs in browser</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Metadata-first scan</span>
            </div>
            <div className="mt-4 rounded-xl border border-border/60 bg-secondary/25 px-4 py-3 text-sm text-muted-foreground max-w-xl">
              ShipSeal analyzes repository structure and metadata. It does not execute uploaded code.
            </div>
          </div>

          <div className="relative animate-fade-in lg:animate-scale-in">
            <div className="absolute -inset-8 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative glass-strong rounded-3xl p-6 shadow-elegant">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground font-mono">Sample report</div>
                  <div className="font-display font-semibold text-lg truncate">sample-nextjs-app</div>
                </div>
                <ReadinessBadge level="AI Coding Ready" size="sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center">
                <ScoreGauge score={92} size={160} />
                <div className="space-y-2.5">
                  <Row icon={<Gauge className="h-3.5 w-3.5 text-success" />} label="Status" value="AI Coding Ready" />
                  <Row icon={<FileCheck2 className="h-3.5 w-3.5 text-accent" />} label="Critical blockers" value="0" />
                  <Row icon={<FileText className="h-3.5 w-3.5 text-primary-glow" />} label="Delivery Pack" value="26 files" />
                  <Row icon={<Shield className="h-3.5 w-3.5 text-success" />} label="MCP Pack" value="4 files" />
                </div>
              </div>
              <div className="mt-5 rounded-xl bg-[hsl(240_20%_4%)] border border-border/60 p-3 font-mono text-[11px] text-foreground/85 leading-relaxed overflow-x-auto">
                <span className="text-muted-foreground"># AGENTS.md</span><br />
                <span className="text-accent">## Detected stack</span><br />
                - Next.js / React / TypeScript<br />
                <span className="text-accent">## Allowed commands</span><br />
                - <span className="text-primary-glow">pnpm test</span> - <span className="text-primary-glow">pnpm build</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="container py-20">
        <SectionHeader eyebrow="What ShipSeal does" title="From repository scan to delivery pack handoff." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
          {WHAT_IT_DOES.map((item, index) => (
            <div key={item.title} className="glass rounded-2xl p-6 relative overflow-hidden group hover:border-primary/40 transition-all">
              <div className="absolute top-0 right-0 text-7xl font-display font-bold text-foreground/[0.04]">0{index + 1}</div>
              <item.icon className="h-6 w-6 text-primary-glow mb-3" />
              <div className="font-display font-semibold text-lg">{item.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="score" className="container py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <SectionHeader eyebrow="The score" title="One number you can actually trust." inline />
            <p className="text-muted-foreground mt-4 text-lg">
              The readiness score is calculated from repository signals, not AI guesswork. It turns a scan into a clear go/no-go handoff signal with visible blockers.
            </p>
            <div className="mt-6 space-y-2">
              {LEVELS.map(level => (
                <div key={level.label} className="flex items-center gap-3">
                  <div className="w-24 font-mono text-xs text-muted-foreground">{level.range}</div>
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full ${level.bar}`} style={{ width: level.width }} />
                  </div>
                  <div className="w-44 text-sm">{level.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="glass-strong rounded-3xl p-8 relative">
              <div className="absolute -inset-4 bg-gradient-primary/30 blur-2xl rounded-full -z-10" />
              <ScoreGauge score={92} size={260} />
              <div className="text-center mt-4">
                <ReadinessBadge level="AI Coding Ready" size="lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pack" className="container py-20">
        <SectionHeader eyebrow="What you get" title="A client-ready AI project delivery package." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {WHAT_YOU_GET.map(item => (
            <div key={item.title} className="glass rounded-2xl p-5 hover:border-primary/40 transition-all group">
              <item.icon className="h-5 w-5 text-primary-glow mb-2.5 group-hover:scale-110 transition-transform" />
              <div className="font-display text-base font-semibold">{item.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="safety" className="container py-20">
        <SectionHeader eyebrow="Trust and safety" title="Local-first, metadata-first, deterministic." />
        <div className="grid md:grid-cols-3 gap-5 mt-10">
          {SAFETY.map(item => (
            <div key={item.title} className="glass rounded-2xl p-6">
              <item.icon className="h-5 w-5 text-accent mb-3" />
              <div className="font-display font-semibold">{item.title}</div>
              <div className="text-sm text-muted-foreground mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-24">
        <div className="glass-strong rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-hero opacity-50 pointer-events-none" />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">See ShipSeal in under a minute.</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Open the sample report, scan a ZIP, or try a public GitHub repo with manual ZIP fallback if browser import is unavailable.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button size="lg" onClick={onScrollScan} className="bg-gradient-primary border-0 shadow-glow hover:opacity-90">
                Start a scan <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={onSampleReport}>
                View sample report
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-gradient-primary flex items-center justify-center"><Sparkles className="h-3 w-3 text-primary-foreground" /></div>
            <span>ShipSeal - AI Project Delivery Pack Generator.</span>
          </div>
          <div>ShipSeal MVP v{appVersion}</div>
        </div>
      </footer>
    </>
  );
}

function SectionHeader({ eyebrow, title, inline }: { eyebrow: string; title: string; inline?: boolean }) {
  return (
    <div className={inline ? '' : 'max-w-3xl'}>
      <div className="text-xs font-mono uppercase tracking-wider text-primary-glow mb-3">{eyebrow}</div>
      <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="inline-flex items-center gap-1.5 text-muted-foreground">{icon} {label}</span>
      <span className="text-foreground/90 font-medium text-right">{value}</span>
    </div>
  );
}

const WHAT_IT_DOES = [
  { icon: Upload, title: 'Scan a repo', desc: 'Upload a ZIP or import a public GitHub repository.' },
  { icon: Gauge, title: 'Calculate readiness', desc: 'Score structure, docs, commands, security, and governance.' },
  { icon: FileCheck2, title: 'Identify blockers', desc: 'Show critical blockers that prevent AI Coding Ready status.' },
  { icon: FileText, title: 'Prepare the Delivery Pack', desc: 'Generate agent instructions, skills, tests, governance, and client handoff files.' },
  { icon: ShieldCheck, title: 'Summarize governance risks', desc: 'Explain MCP, AI Act, privacy, testing, and handoff readiness in one place.' },
  { icon: FileArchive, title: 'Export a client-ready ZIP', desc: 'Download the full ShipSeal Delivery Pack with structured folders and score.json.' },
];

const LEVELS = [
  { range: '0-39', label: 'Not Ready', bar: 'bg-destructive', width: '20%' },
  { range: '40-64', label: 'Partially Ready', bar: 'bg-warning', width: '45%' },
  { range: '65-84', label: 'Almost Ready', bar: 'bg-accent', width: '70%' },
  { range: '85-94', label: 'AI Coding Ready', bar: 'bg-success', width: '88%' },
  { range: '95-100', label: 'ShipSeal Certified', bar: 'bg-gradient-primary', width: '98%' },
];

const WHAT_YOU_GET = [
  { title: 'Agent instructions', desc: 'AGENTS.md, CLAUDE.md, Codex prompts, and reviewer guidance for safe AI-assisted work.', icon: FileText },
  { title: 'Skills pack', desc: 'Five ready-to-use skills for review, tests, AI Act pre-screening, release checks, and client handoff.', icon: BookCheck },
  { title: 'MCP governance', desc: 'MCP readiness, security policy, server recommendations, and tool allowlist.', icon: ServerCog },
  { title: 'Eval and red-team tests', desc: 'Client-readable testing strategy, eval cases, and safe red-team validation prompts.', icon: FileCheck2 },
  { title: 'AI Act readiness', desc: 'Pre-screen checklist, transparency notice draft, and legal review questions.', icon: Scale },
  { title: 'Client handoff report', desc: 'Executive summary, go/no-go recommendation, and 30/60/90 day roadmap.', icon: FileArchive },
];

const SAFETY = [
  { icon: Gauge, title: 'Deterministic score', desc: 'Generated narrative explains the result, but deterministic checks decide readiness.' },
  { icon: Lock, title: 'No code execution', desc: 'ShipSeal reads repository structure and selected text metadata only.' },
  { icon: ShieldCheck, title: 'Metadata-only history', desc: 'Recent scans store lightweight source and score metadata, not raw files.' },
  { icon: ServerCog, title: 'Separate MCP readiness', desc: 'MCP is a governance layer, not a replacement for the main readiness rule.' },
  { icon: GitBranch, title: 'Public GitHub import', desc: 'Public repos can be imported when browser ZIP fetch is available.' },
  { icon: Workflow, title: 'Manual fallback', desc: 'If GitHub browser import fails, ZIP upload remains the supported fallback.' },
];
