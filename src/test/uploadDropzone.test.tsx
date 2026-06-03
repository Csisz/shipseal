import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { UploadDropzone } from '@/components/agentready/UploadDropzone';

describe('UploadDropzone GitHub import copy', () => {
  it('shows local MVP CORS and ZIP fallback guidance', () => {
    render(<UploadDropzone onFile={vi.fn()} onGitHubImport={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /import from github/i }));

    expect(screen.getByText(/Paste a public GitHub repository URL or upload a ZIP/i)).toBeInTheDocument();
    expect(screen.getByText(/Public GitHub import may be blocked by browser CORS restrictions in local mode/i)).toBeInTheDocument();
    expect(screen.getByText(/Local MVP note: if GitHub import is blocked, use Download ZIP on GitHub and upload it here/i)).toBeInTheDocument();
  });
});
