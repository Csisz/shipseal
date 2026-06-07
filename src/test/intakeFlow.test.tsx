import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import Index from '@/pages/Index';

vi.mock('@/components/agentready/Landing', () => ({
  Landing: ({ onScrollScan }: { onScrollScan: () => void }) => (
    <button type="button" onClick={onScrollScan}>Go to scan</button>
  ),
}));

vi.mock('@/components/agentready/UploadDropzone', () => ({
  UploadDropzone: ({ onFile }: { onFile: (file: File) => void }) => (
    <button
      type="button"
      onClick={() => onFile(new File(['demo'], 'real-repo.zip', { type: 'application/zip' }))}
    >
      Analyze repository
    </button>
  ),
}));

describe('ShipSeal pre-scan intake flow', () => {
  it('shows simplified optional Project Intake actions after ZIP selection', async () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    expect(screen.getByText('Step 1: Add repository')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /analyze repository/i }));

    expect(screen.getByText('Step 2: Add project context')).toBeInTheDocument();
    expect(screen.getByText(/Repository scan tells ShipSeal what the code looks like/i)).toBeInTheDocument();
    expect(screen.getByText(/Optional, but recommended for client-ready reports/i)).toBeInTheDocument();
    expect(screen.getByText(/You can continue without project context, but the client report will be more generic/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Back$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Continue$/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /skip intake and scan repository only/i })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Project name')).toHaveValue('real-repo');
    expect(screen.getByLabelText('Project name')).not.toHaveValue('Customer Support RAG Assistant');

    fireEvent.click(screen.getByRole('button', { name: /^Continue$/i }));

    expect(screen.getByText(/Scanning repository/i)).toBeInTheDocument();
  });
});
