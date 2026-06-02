import {
  ArrowRight,
  BookCheck,
  CheckCircle2,
  ClipboardCheck,
  Euro,
  FileArchive,
  FileCheck2,
  FileText,
  Gauge,
  GitBranch,
  Lock,
  Mail,
  Rocket,
  Scale,
  ServerCog,
  Shield,
  ShieldCheck,
  Sparkles,
  Upload,
  Users,
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
              <span className="text-muted-foreground">AI Project Delivery Pack Generator. Local-first MVP. No code execution.</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
              Seal your AI project before you ship it.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              ShipSeal turns AI prototypes into agent-ready, testable and client-ready delivery packs.
            </p>
            <p className="mt-4 text-sm text-muted-foreground max-w-xl">
              Scan a repository ZIP, fill a lightweight AI project intake, review the ShipSeal score, then export a structured Delivery Pack for client handover and expert review.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={onSampleReport} className="bg-gradient-primary border-0 shadow-glow hover:opacity-90">
                Try sample project <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={onScrollScan} className="border-border/80">
                Generate Delivery Pack
              </Button>
              <Button size="lg" variant="outline" asChild className="border-border/80">
                <a href="mailto:hello@shipseal.dev?subject=Founder-reviewed%20ShipSeal%20audit%20request">
                  Request founder-reviewed audit
                </a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Lock className="h-3 w-3" /> No code execution</span>
              <span className="inline-flex items-center gap-1.5"><Zap className="h-3 w-3" /> Runs in browser</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3 w-3" /> Deterministic outputs</span>
            </div>
          </div>

          <div className="relative animate-fade-in lg:animate-scale-in">
            <div className="absolute -inset-8 bg-gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative glass-strong rounded-3xl p-6 shadow-elegant">
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground font-mono">Sample Delivery Pack</div>
                  <div className="font-display font-semibold text-lg truncate">Customer Support RAG Assistant</div>
                </div>
                <ReadinessBadge level="Almost Ready" size="sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center">
                <ScoreGauge score={82} size={160} />
                <div className="space-y-2.5">
                  <Row icon={<Gauge className="h-3.5 w-3.5 text-accent" />} label="Go/no-go" value="Conditional Go" />
                  <Row icon={<FileCheck2 className="h-3.5 w-3.5 text-primary-glow" />} label="Eval tests" value="30 cases" />
                  <Row icon={<Shield className="h-3.5 w-3.5 text-warning" />} label="AI Act" value="Review recommended" />
                  <Row icon={<FileText className="h-3.5 w-3.5 text-success" />} label="Delivery Pack" value="27 files" />
                </div>
              </div>
              <div className="mt-5 rounded-xl bg-[hsl(240_20%_4%)] border border-border/60 p-3 font-mono text-[11px] text-foreground/85 leading-relaxed overflow-x-auto">
                <span className="text-muted-foreground"># CLIENT_HANDOFF_REPORT.md</span><br />
                <span className="text-accent">## Executive summary</span><br />
                - Client-ready readiness snapshot<br />
                - Go/no-go recommendation<br />
                - 30/60/90 day next steps<br />
                <span className="text-primary-glow">Generated by ShipSeal</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="generates" className="container py-20">
        <SectionHeader eyebrow="What ShipSeal generates" title="The files an AI project needs before handoff." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
          {GENERATED_OUTPUTS.map(item => (
            <div key={item.title} className="glass rounded-2xl p-5 hover:border-primary/40 transition-all group">
              <item.icon className="h-5 w-5 text-primary-glow mb-2.5 group-hover:scale-110 transition-transform" />
              <div className="font-display text-base font-semibold">{item.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="who" className="container py-20">
        <SectionHeader eyebrow="Who it is for" title="Built for people delivering AI work to real clients." />
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-10">
          {AUDIENCES.map(item => (
            <div key={item} className="glass rounded-2xl p-5">
              <Users className="h-5 w-5 text-accent mb-3" />
              <div className="font-display text-sm font-semibold">{item}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="container py-20">
        <SectionHeader eyebrow="Pilot pricing" title="Validation packages for the MVP phase." />
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mt-10">
          {PRICING_TIERS.map(tier => (
            <div key={tier.name} className={`glass rounded-2xl p-6 flex flex-col ${tier.featured ? 'border-primary/50 shadow-glow' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <tier.icon className="h-5 w-5 text-primary-glow" />
                <div className="font-display font-semibold">{tier.name}</div>
              </div>
              <div className="text-2xl font-display font-bold">{tier.price}</div>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground flex-1">
                {tier.features.map(feature => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-border/60 bg-secondary/25 p-5 flex flex-col md:flex-row md:items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="font-display font-semibold">Want a founder-reviewed audit?</div>
            <p className="text-sm text-muted-foreground mt-1">Use the MVP report as the starting point, then request manual expert review and a client-ready improvement pass.</p>
          </div>
          <Button asChild className="bg-gradient-primary border-0 shadow-glow hover:opacity-90">
            <a href="mailto:hello@shipseal.dev?subject=Founder-reviewed%20ShipSeal%20audit%20request">
              <Mail className="h-4 w-4 mr-1.5" /> Request founder-reviewed audit
            </a>
          </Button>
        </div>
      </section>

      <section id="how" className="container py-20">
        <SectionHeader eyebrow="How it works" title="From repository scan to delivery pack handoff." />
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
            <SectionHeader eyebrow="The score" title="A practical go/no-go signal for handoff." inline />
            <p className="text-muted-foreground mt-4 text-lg">
              The readiness score is calculated from repository signals, not AI guesswork. It turns a scan into visible blockers, recommendations, and a client-readable handoff decision.
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
              <ScoreGauge score={82} size={260} />
              <div className="text-center mt-4">
                <ReadinessBadge level="Almost Ready" size="lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="disclaimer" className="container py-20">
        <SectionHeader eyebrow="Important disclaimer" title="ShipSeal supports review. It does not replace experts." />
        <div className="grid md:grid-cols-2 gap-4 mt-10">
          {DISCLAIMERS.map(item => (
            <div key={item} className="glass rounded-2xl p-5 flex gap-3">
              <ShieldCheck className="h-5 w-5 text-warning shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">{item}</p>
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
            <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight">Validate ShipSeal with a real-looking sample.</h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Open the sample project, generate a Delivery Pack from a scan, or request a founder-reviewed audit for a client-facing project.</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button size="lg" onClick={onSampleReport} className="bg-gradient-primary border-0 shadow-glow hover:opacity-90">
                Try sample project <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={onScrollScan}>
                Generate Delivery Pack
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="mailto:hello@shipseal.dev?subject=Founder-reviewed%20ShipSeal%20audit%20request">
                  Request founder-reviewed audit
                </a>
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

const GENERATED_OUTPUTS = [
  { title: 'Agent instructions', desc: 'AGENTS.md, CLAUDE.md, Codex/reviewer prompts for safe AI-assisted delivery.', icon: FileText },
  { title: 'Skills pack', desc: 'Reusable SKILL.md files for AI coding agents.', icon: BookCheck },
  { title: 'MCP governance', desc: 'Readiness, allowlist and security policy for MCP adoption.', icon: ServerCog },
  { title: 'Eval and red-team tests', desc: '30 eval tests and 10 red-team prompts for AI app validation.', icon: FileCheck2 },
  { title: 'AI Act readiness', desc: 'Preliminary checklist and transparency notice draft.', icon: Scale },
  { title: 'Client handoff report', desc: 'White-label delivery report for client handover.', icon: FileArchive },
];

const AUDIENCES = [
  'AI freelancers',
  'Small AI agencies',
  'No-code/low-code AI builders',
  'Indie SaaS teams',
  'Consultants delivering AI automations to clients',
];

const PRICING_TIERS = [
  { name: 'Free Preview', price: 'Free', icon: ClipboardCheck, featured: false, features: ['readiness preview', 'limited recommendations', 'sample output'] },
  { name: 'Starter Report', price: '49 EUR', icon: FileText, featured: false, features: ['AGENTS.md', 'CLAUDE.md', '30 eval tests', 'mini AI Act checklist'] },
  { name: 'Pro Agency Report', price: '149 EUR', icon: Rocket, featured: true, features: ['full Delivery Pack', 'skills pack', 'red-team prompts', 'MCP governance', 'client handoff report'] },
  { name: 'Founder-reviewed Audit', price: '499 EUR+', icon: Euro, featured: false, features: ['manual expert review', 'improved client report', '60-minute review call'] },
];

const WHAT_IT_DOES = [
  { icon: Upload, title: 'Scan a repo', desc: 'Upload a ZIP or import a public GitHub repository.' },
  { icon: Gauge, title: 'Calculate readiness', desc: 'Score structure, docs, commands, security, and governance.' },
  { icon: FileCheck2, title: 'Identify blockers', desc: 'Show critical blockers that prevent clean client handoff.' },
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

const DISCLAIMERS = [
  'ShipSeal does not provide legal advice.',
  'AI Act readiness output is a preliminary technical and product-side checklist.',
  'Security output is not a full production security audit.',
  'The report is designed to support client handover and further expert review.',
];

const SAFETY = [
  { icon: Gauge, title: 'Deterministic score', desc: 'Generated narrative explains the result, but deterministic checks decide readiness.' },
  { icon: Lock, title: 'No code execution', desc: 'ShipSeal reads repository structure and selected text metadata only.' },
  { icon: ShieldCheck, title: 'Metadata-only history', desc: 'Recent scans store lightweight source and score metadata, not raw files.' },
  { icon: ServerCog, title: 'Separate MCP readiness', desc: 'MCP is a governance layer, not a replacement for the main readiness rule.' },
  { icon: GitBranch, title: 'Public GitHub import', desc: 'Public repos can be imported when browser ZIP fetch is available.' },
  { icon: Workflow, title: 'Manual fallback', desc: 'If GitHub browser import fails, ZIP upload remains the supported fallback.' },
];
