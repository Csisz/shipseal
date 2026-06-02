import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DeliveryPackPreview } from '@/components/agentready/DeliveryPackPreview';
import { buildSampleReport } from '@/lib/readiness';
import { createDefaultProjectIntake } from '@/lib/intake';

describe('DeliveryPackPreview', () => {
  it('renders the main preview information and export action', () => {
    const report = buildSampleReport();
    const intake = {
      ...createDefaultProjectIntake(report.repoName),
      usedInEU: true,
      generatesUserFacingContent: true,
      handlesPersonalData: true,
    };

    render(<DeliveryPackPreview report={report} intake={intake} />);

    expect(screen.getByText('ShipSeal Delivery Pack preview')).toBeInTheDocument();
    expect(screen.getByText('ShipSeal score')).toBeInTheDocument();
    expect(screen.getByText(`${report.score}/100`)).toBeInTheDocument();
    expect(screen.getByText('Go/no-go category')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /open print-ready report/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download shipseal delivery pack/i })).toBeInTheDocument();
    expect(screen.getByText('AI Act readiness')).toBeInTheDocument();
    expect(screen.getByText('Testing pack')).toBeInTheDocument();
    expect(screen.getByText('Client handoff')).toBeInTheDocument();
    expect(screen.getByText('01-agent-instructions/AGENTS.md')).toBeInTheDocument();
    expect(screen.getByText('06-client-handoff/CLIENT_HANDOFF_REPORT.md')).toBeInTheDocument();
    expect(screen.getByText('06-client-handoff/CLIENT_HANDOFF_REPORT.html')).toBeInTheDocument();
  });
});
