import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SuggestedReadinessFixPack } from '@/components/agentready/SuggestedReadinessFixPack';
import { buildSampleReport } from '@/lib/readiness';

describe('SuggestedReadinessFixPack', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders suggested files, score mapping, and Create Readiness PR action', () => {
    render(<SuggestedReadinessFixPack report={buildSampleReport()} />);

    expect(screen.getByText('Suggested Readiness Fix Pack')).toBeInTheDocument();
    expect(screen.getByText(/ShipSeal can generate the missing repository files/i)).toBeInTheDocument();
    expect(screen.getAllByText('AGENTS.md').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CLAUDE.md').length).toBeGreaterThan(0);
    expect(screen.getAllByText('CONTRIBUTING.md').length).toBeGreaterThan(0);
    expect(screen.getAllByText('.github/workflows/ci.yml').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/AI agent instruction readiness/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/These files are already included in your Delivery Pack/i)).toBeInTheDocument();
    expect(screen.getByText('Delivery Pack')).toBeInTheDocument();
    expect(screen.getByText(/Client handoff package with reports, AI Act readiness, testing pack and agent instructions/i)).toBeInTheDocument();
    expect(screen.getByText('Readiness Fix Pack')).toBeInTheDocument();
    expect(screen.getByText(/Repository files you can add back to your project to improve future scans/i)).toBeInTheDocument();
    expect(screen.getAllByText('Create Readiness PR').length).toBeGreaterThan(0);
    expect(screen.getByText('MVP write')).toBeInTheDocument();
    expect(screen.getByText(/Preview the repository changes ShipSeal would propose in a safe pull request/i)).toBeInTheDocument();
    expect(screen.getByText('shipseal/readiness-pack')).toBeInTheDocument();
    expect(screen.getByText('Add ShipSeal readiness and agent governance pack')).toBeInTheDocument();
    expect(screen.getByText(/ShipSeal will not push directly to main/i)).toBeInTheDocument();
    expect(screen.getByText(/Then open a Pull Request on GitHub/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Create Readiness PR$/i })).toBeEnabled();
    expect(screen.getAllByText(/Copy manual Git steps/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Download Readiness Fix Pack/i).length).toBeGreaterThan(0);
  });

  it('opens the Create Readiness PR modal, validates token, and shows success URL', async () => {
    const report = {
      ...buildSampleReport(),
      source: {
        sourceType: 'github-url' as const,
        githubOwner: 'Csisz',
        githubRepo: 'shipseal',
        githubBranch: 'main',
        sourceUrl: 'https://github.com/Csisz/shipseal',
      },
    };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ok: true,
        pullRequestUrl: 'https://github.com/Csisz/shipseal/pull/12',
        branchName: 'shipseal/readiness-pack',
        baseBranch: 'main',
        fileCount: 8,
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<SuggestedReadinessFixPack report={report} />);
    fireEvent.click(screen.getByRole('button', { name: /^Create Readiness PR$/i }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText(/Step 1: Review changes/i)).toBeInTheDocument();
    expect(within(dialog).getByText('shipseal/readiness-pack')).toBeInTheDocument();
    expect(within(dialog).getByText('AGENTS.md')).toBeInTheDocument();
    expect(within(dialog).getByText('.github/workflows/ci.yml')).toBeInTheDocument();
    expect(within(dialog).getByText(/This PR includes a GitHub Actions workflow file/i)).toBeInTheDocument();
    expect(within(dialog).getByLabelText('GitHub token')).toBeInTheDocument();
    expect(within(dialog).getByLabelText(/I understand ShipSeal will create a branch/i)).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /Create Pull Request/i }));
    expect(within(dialog).getByText(/GitHub token is required/i)).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.change(within(dialog).getByLabelText('GitHub token'), { target: { value: 'ghp_mock' } });
    fireEvent.click(within(dialog).getByLabelText(/I understand ShipSeal will create a branch/i));
    fireEvent.click(within(dialog).getByRole('button', { name: /Create Pull Request/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/create-readiness-pr', expect.objectContaining({ method: 'POST' })));
    expect(await within(dialog).findByText(/Readiness PR created/i)).toBeInTheDocument();
    expect(within(dialog).getByText('https://github.com/Csisz/shipseal/pull/12')).toBeInTheDocument();

    const [, request] = fetchMock.mock.calls[0];
    const payload = JSON.parse(request.body);
    expect(payload).toMatchObject({
      owner: 'Csisz',
      repo: 'shipseal',
      baseBranch: 'main',
      branchName: 'shipseal/readiness-pack',
    });
    expect(payload.files.map((file: { path: string }) => file.path)).toContain('.github/workflows/ci.yml');
  });
});
