import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SuggestedReadinessFixPack } from '@/components/agentready/SuggestedReadinessFixPack';
import { buildSampleReport } from '@/lib/readiness';

describe('SuggestedReadinessFixPack', () => {
  it('renders suggested files, score mapping, and coming soon PR CTA', () => {
    render(<SuggestedReadinessFixPack report={buildSampleReport()} />);

    expect(screen.getByText('Suggested Readiness Fix Pack')).toBeInTheDocument();
    expect(screen.getByText(/ShipSeal can generate the missing repository files/i)).toBeInTheDocument();
    expect(screen.getAllByText('AGENTS.md').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CLAUDE.md').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CONTRIBUTING.md').length).toBeGreaterThan(0);
    expect(screen.getAllByText('.github/workflows/ci.yml').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AI agent instruction readiness/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/These files are already included in your Delivery Pack/i)).toBeInTheDocument();
    expect(screen.getByText('Create Readiness PR - coming soon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Readiness PR/i })).toBeDisabled();
  });
});
