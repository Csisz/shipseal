import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseGitHubUrl } from '@/lib/github/parseGitHubUrl';
import { buildGitHubZipUrl, GitHubImportError, importPublicGitHubRepo } from '@/lib/github/githubImport';
import { LocalScanEngine } from '@/lib/scanEngine';
import type { ScanSourceMetadata } from '@/lib/types';
import JSZip from 'jszip';

async function demoZipFile(name = 'shipseal-main.zip') {
  const zip = new JSZip();
  zip.file('shipseal-main/package.json', JSON.stringify({ scripts: { test: 'vitest', build: 'vite build' } }));
  zip.file('shipseal-main/README.md', '# ShipSeal\n\n## Overview\nDemo public repo.\n\n## Setup\nnpm install\n');
  zip.file('shipseal-main/src/index.ts', 'export const ok = true;');
  const blob = await zip.generateAsync({ type: 'blob' });
  return new File([blob], name, { type: 'application/zip' });
}

describe('public GitHub import helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses supported public GitHub URL formats', () => {
    for (const value of [
      'https://github.com/Csisz/shipseal',
      'https://github.com/Csisz/shipseal.git',
      'github.com/Csisz/shipseal',
    ]) {
      const parsed = parseGitHubUrl(value);

      expect(parsed.owner).toBe('Csisz');
      expect(parsed.repo).toBe('shipseal');
      expect(parsed.normalizedUrl).toBe('https://github.com/Csisz/shipseal');
    }
  });

  it('returns invalid URL errors for unsupported values', () => {
    expect(() => parseGitHubUrl('not a repo')).toThrow('whitespace');
    expect(() => parseGitHubUrl('https://gitlab.com/Csisz/shipseal')).toThrow('Only public github.com');
  });

  it('builds a codeload ZIP URL for default and explicit branches', () => {
    expect(buildGitHubZipUrl('Csisz', 'shipseal')).toBe('https://codeload.github.com/Csisz/shipseal/zip/HEAD');
    expect(buildGitHubZipUrl('Csisz', 'shipseal', 'main')).toBe('https://codeload.github.com/Csisz/shipseal/zip/refs/heads/main');
  });

  it('keeps github-url source metadata when public import succeeds', async () => {
    const file = await demoZipFile();
    const headers = new Headers({ 'content-length': String(file.size) });
    vi.stubGlobal('fetch', vi.fn(async () => new Response(file, { status: 200, headers })));

    const imported = await importPublicGitHubRepo({ url: 'github.com/Csisz/shipseal', branch: 'main' });

    expect(imported.file.name).toBe('Csisz-shipseal-main.zip');
    expect(imported.source).toMatchObject({
      sourceType: 'github-url',
      githubOwner: 'Csisz',
      githubRepo: 'shipseal',
      githubBranch: 'main',
      sourceUrl: 'https://github.com/Csisz/shipseal/tree/main',
    } satisfies ScanSourceMetadata);
  });

  it('returns a clear fallback message when public import fails', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      throw new TypeError('network blocked');
    }));

    await expect(importPublicGitHubRepo({ url: 'https://github.com/Csisz/shipseal' }))
      .rejects
      .toMatchObject({
        name: 'GitHubImportError',
        fallbackMessage: 'If GitHub import fails, download the repository as ZIP and upload it manually.',
      } satisfies Partial<GitHubImportError>);
  });

  it('ZIP upload flow still works with zip-upload source metadata', async () => {
    const file = await demoZipFile('zip-upload.zip');
    const report = await new LocalScanEngine().scan({
      file,
      mode: 'local',
      source: { sourceType: 'zip-upload' },
    });

    expect(report.source.sourceType).toBe('zip-upload');
    expect(report.repoName).toBeTruthy();
  });
});
