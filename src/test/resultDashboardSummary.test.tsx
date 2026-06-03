import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ResultDashboard } from '@/components/agentready/ResultDashboard';
import { buildSampleReport } from '@/lib/readiness';

describe('ResultDashboard summary copy', () => {
  it('uses compact Delivery Pack summary text that does not truncate the old wording', () => {
    render(
      <ResultDashboard
        report={buildSampleReport()}
        history={[]}
        onReset={vi.fn()}
        onClearHistory={vi.fn()}
      />
    );

    expect(screen.getByText('Full pack - 27 outputs')).toBeInTheDocument();
    expect(screen.queryByText('Full Delivery Pack: 27 required outputs')).not.toBeInTheDocument();
    expect(screen.getByText(/Agent instructions, skills, MCP governance, tests, AI Act readiness and client handoff report/i)).toBeInTheDocument();
    expect(screen.getByText(/Detailed scan results, governance and generated file previews/i)).toBeInTheDocument();
  });

  it('shows skipped intake warning and regenerate action after intake edits', () => {
    render(
      <ResultDashboard
        report={buildSampleReport()}
        history={[]}
        onReset={vi.fn()}
        onClearHistory={vi.fn()}
        intakeSkipped
      />
    );

    expect(screen.getAllByText(/Client report quality is limited because project intake was skipped/i).length).toBeGreaterThan(0);
    expect(screen.getByText('Project context used for this report')).toBeInTheDocument();
    expect(screen.getByText('Edit project context')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Client name'), { target: { value: 'Acme Client' } });

    expect(screen.getByText(/Project context was edited/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /regenerate report with updated intake/i })).toBeEnabled();
  });
});
