import type React from 'react';
import { Bot, Building2, Globe2, ShieldCheck, UserCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import type { ProjectIntake } from '@/lib/intake';

interface Props {
  value: ProjectIntake;
  onChange: (value: ProjectIntake) => void;
}

export function ProjectIntakeForm({ value, onChange }: Props) {
  const update = <K extends keyof ProjectIntake>(key: K, nextValue: ProjectIntake[K]) => {
    onChange({ ...value, [key]: nextValue });
  };

  return (
    <div className="glass rounded-2xl p-6 mb-8">
      <div className="flex items-center gap-2 mb-5">
        <Bot className="h-4 w-4 text-primary-glow" />
        <h3 className="font-display font-semibold">Project intake</h3>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Project name">
          <Input value={value.projectName} onChange={event => update('projectName', event.target.value)} />
        </Field>
        <Field label="Client name">
          <Input value={value.clientName || ''} onChange={event => update('clientName', event.target.value)} />
        </Field>
        <Field label="Agency name">
          <Input value={value.agencyName || ''} onChange={event => update('agencyName', event.target.value)} />
        </Field>
        <Field label="AI provider">
          <Input value={value.aiProvider} onChange={event => update('aiProvider', event.target.value)} placeholder="OpenAI, Anthropic, local, other" />
        </Field>
        <Field label="Model name">
          <Input value={value.modelName} onChange={event => update('modelName', event.target.value)} placeholder="gpt-4.1, claude, local model" />
        </Field>
        <Field label="Target users">
          <Input value={value.targetUsers} onChange={event => update('targetUsers', event.target.value)} />
        </Field>
        <Field label="App description" className="md:col-span-2">
          <Textarea value={value.appDescription} onChange={event => update('appDescription', event.target.value)} />
        </Field>
        <Field label="AI use case" className="md:col-span-2">
          <Textarea value={value.aiUseCase} onChange={event => update('aiUseCase', event.target.value)} />
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
        <ToggleRow
          icon={<Globe2 className="h-3.5 w-3.5" />}
          label="Used in EU"
          checked={value.usedInEU}
          onCheckedChange={checked => update('usedInEU', checked)}
        />
        <ToggleRow
          icon={<ShieldCheck className="h-3.5 w-3.5" />}
          label="Personal data"
          checked={value.handlesPersonalData}
          onCheckedChange={checked => update('handlesPersonalData', checked)}
        />
        <ToggleRow
          icon={<Building2 className="h-3.5 w-3.5" />}
          label="User-facing content"
          checked={value.generatesUserFacingContent}
          onCheckedChange={checked => update('generatesUserFacingContent', checked)}
        />
        <ToggleRow
          icon={<UserCheck className="h-3.5 w-3.5" />}
          label="Human approval"
          checked={value.hasHumanApproval}
          onCheckedChange={checked => update('hasHumanApproval', checked)}
        />
      </div>
    </div>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="block text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function ToggleRow({ icon, label, checked, onCheckedChange }: { icon: React.ReactNode; label: string; checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <div className="rounded-lg border border-border/60 bg-secondary/25 px-3 py-2.5 flex items-center justify-between gap-3">
      <div className="min-w-0 flex items-center gap-2 text-sm text-foreground/90">
        <span className="text-primary-glow shrink-0">{icon}</span>
        <span className="truncate">{label}</span>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
