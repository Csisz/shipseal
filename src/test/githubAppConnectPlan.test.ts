import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import startHandler from '../../api/github-app/start';
import callbackHandler from '../../api/github-app/callback';
import repositoriesHandler from '../../api/github-app/repositories';

function createResponse() {
  return {
    statusCode: 0,
    body: '',
    setHeader: vi.fn(),
    end(value: string) {
      this.body = value;
    },
    json() {
      return JSON.parse(this.body);
    },
  };
}

describe('GitHub App Connect plan', () => {
  it.each([
    ['start', startHandler],
    ['callback', callbackHandler],
    ['repositories', repositoriesHandler],
  ])('/api/github-app/%s returns a planned not implemented response', async (_name, handler) => {
    const res = createResponse();

    await handler({ method: 'GET' } as never, res as never);

    expect(res.statusCode).toBe(501);
    expect(res.json()).toEqual({
      status: 'not_implemented',
      message: 'GitHub App connection is planned. Use temporary token mode for now.',
    });
  });

  it('documents the GitHub App architecture and README roadmap', () => {
    expect(existsSync('docs/GITHUB_APP_CONNECT_PLAN.md')).toBe(true);

    const plan = readFileSync('docs/GITHUB_APP_CONNECT_PLAN.md', 'utf8');
    const readme = readFileSync('README.md', 'utf8');

    expect(plan).toContain('Metadata: read');
    expect(plan).toContain('Contents: read/write');
    expect(plan).toContain('Pull requests: read/write');
    expect(plan).toContain('Workflows: read/write');
    expect(plan).toContain('Never push directly to `main`');
    expect(plan).toContain('VITE_GITHUB_APP_SLUG');
    expect(plan).toContain('VITE_GITHUB_APP_INSTALL_URL');
    expect(plan).toContain('Create a GitHub App For Local/Demo Testing');
    expect(plan).toContain('GITHUB_APP_ID');
    expect(plan).toContain('GITHUB_APP_CALLBACK_URL');
    expect(readme).toContain('Connect GitHub Roadmap');
    expect(readme).toContain('Connect GitHub` opens the GitHub App install page');
    expect(readme).toContain('Create a GitHub App for local/demo testing');
    expect(readme).toContain('temporary token mode');
    expect(readme).toContain('private repository support through GitHub App installation');
  });
});
