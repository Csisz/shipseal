import { render, screen } from '@testing-library/react';
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

    expect(screen.getByText('Full pack · 27 outputs')).toBeInTheDocument();
    expect(screen.queryByText('Full Delivery Pack: 27 required outputs')).not.toBeInTheDocument();
    expect(screen.getByText(/Agent instructions, skills, MCP governance, tests, AI Act readiness and client handoff report/i)).toBeInTheDocument();
  });
});
