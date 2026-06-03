import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Index from '@/pages/Index';

describe('ShipSeal pre-scan intake flow', () => {
  it('shows optional Project Intake after ZIP selection and before scanning', async () => {
    const { container } = render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    expect(screen.getByText('Step 1: Add repository')).toBeInTheDocument();

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['demo'], 'real-repo.zip', { type: 'application/zip' });

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: /analyze repository/i }));

    expect(screen.getByText('Step 2: Add project context')).toBeInTheDocument();
    expect(screen.getByText(/Repository scan tells ShipSeal what the code looks like/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue with project context/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /skip intake and scan repository only/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Project name')).toHaveValue('real-repo');
    expect(screen.getByLabelText('Project name')).not.toHaveValue('Customer Support RAG Assistant');
  });
});
