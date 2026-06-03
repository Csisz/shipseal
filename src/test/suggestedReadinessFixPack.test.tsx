import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SuggestedReadinessFixPack } from '@/components/agentready/SuggestedReadinessFixPack';
import { buildSampleReport } from '@/lib/readiness';

describe('SuggestedReadinessFixPack', () => {
  it('renders suggested files, score mapping, and Create Readiness PR preview', () => {
    render(<SuggestedReadinessFixPack report={buildSampleReport()} />);

    expect(screen.getByText('Suggested Readiness Fix Pack')).toBeInTheDocument();
    expect(screen.getByText(/ShipSeal can generate the missing repository files/i)).toBeInTheDocument();
    expect(screen.getAllByText('AGENTS.md').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CLAUDE.md').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CONTRIBUTING.md').length).toBeGreaterThan(0);
    expect(screen.getAllByText('.github/workflows/ci.yml').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AI agent instruction readiness/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/These files are already included in your Delivery Pack/i)).toBeInTheDocument();
    expect(screen.getByText('Create Readiness PR')).toBeInTheDocument();
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    expect(screen.getByText(/Preview the repository changes ShipSeal would propose in a safe pull request/i)).toBeInTheDocument();
    expect(screen.getByText('shipseal/readiness-pack')).toBeInTheDocument();
    expect(screen.getByText('Add ShipSeal readiness and agent governance pack')).toBeInTheDocument();
    expect(screen.getByText(/ShipSeal will not push directly to main/i)).toBeInTheDocument();
    expect(screen.getByText(/Then open a Pull Request on GitHub/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Readiness PR .* coming soon/i })).toBeDisabled();
    expect(screen.getAllByRole('button', { name: /Copy manual Git steps/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /Download suggested files/i }).length).toBeGreaterThan(0);
  });
});
