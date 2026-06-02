import { SCANNER_LIMITS } from '../scannerLimits';
import type { ScanSourceMetadata } from '../types';
import { parseGitHubUrl } from './githubUrl';

export interface GitHubImportInput {
  url: string;
  branch?: string;
}

export interface GitHubImportCallbacks {
  onStepStart?: (step: string, index: number) => void;
  onStepComplete?: (step: string, index: number) => void;
  onProgress?: (progress: number) => void;
}

export interface ImportedGitHubRepo {
  file: File;
  source: ScanSourceMetadata;
}

export class GitHubImportError extends Error {
  fallbackMessage: string;

  constructor(message = 'Automatic GitHub import is unavailable for this repository. Please download the repository ZIP from GitHub and upload it manually.') {
    super(message);
    this.name = 'GitHubImportError';
    this.fallbackMessage = 'Automatic GitHub import is unavailable for this repository. Please download the repository ZIP from GitHub and upload it manually.';
  }
}

function encodeBranch(branch: string) {
  return branch.split('/').map(part => encodeURIComponent(part)).join('/');
}

export function buildGitHubZipUrl(owner: string, repo: string, branch?: string) {
  return branch
    ? `https://github.com/${owner}/${repo}/archive/refs/heads/${encodeBranch(branch)}.zip`
    : `https://github.com/${owner}/${repo}/archive/HEAD.zip`;
}

function step(callbacks: GitHubImportCallbacks, index: number, progress: number, complete = false) {
  const label = index === 0 ? 'Validating GitHub URL' : 'Downloading public repository ZIP';
  if (complete) {
    callbacks.onStepComplete?.(label, index);
  } else {
    callbacks.onStepStart?.(label, index);
  }
  callbacks.onProgress?.(progress);
}

export async function importPublicGitHubRepo(input: GitHubImportInput, callbacks: GitHubImportCallbacks = {}): Promise<ImportedGitHubRepo> {
  step(callbacks, 0, 5);
  let parsed: ReturnType<typeof parseGitHubUrl>;
  try {
    parsed = parseGitHubUrl(input.url);
  } catch (error) {
    throw new GitHubImportError(error instanceof Error ? error.message : 'Enter a valid public GitHub repository URL.');
  }
  const branch = input.branch?.trim() || parsed.branch;
  if (branch && (!/^[A-Za-z0-9._/-]+$/.test(branch) || branch.includes('..') || branch.length > 120)) {
    throw new GitHubImportError('GitHub branch contains unsupported characters.');
  }
  step(callbacks, 0, 12, true);

  step(callbacks, 1, 18);
  const zipUrl = buildGitHubZipUrl(parsed.owner, parsed.repo, branch);

  let response: Response;
  try {
    response = await fetch(zipUrl, { method: 'GET', redirect: 'follow' });
  } catch {
    throw new GitHubImportError('Browser or network access blocked the GitHub ZIP download. Please download the repository ZIP from GitHub and upload it manually.');
  }

  if (!response.ok) {
    if (response.status === 404 || response.status === 403) {
      throw new GitHubImportError('Repository was not found, is private, or cannot be fetched from the browser. Please download the repository ZIP from GitHub and upload it manually.');
    }
    throw new GitHubImportError();
  }

  const contentLength = Number(response.headers.get('content-length') || '0');
  if (contentLength > SCANNER_LIMITS.maxZipSizeBytes) {
    throw new GitHubImportError('GitHub repository ZIP is too large for local scanning. Please download a smaller ZIP or remove generated folders before uploading manually.');
  }

  let blob: Blob;
  try {
    blob = await response.blob();
  } catch {
    throw new GitHubImportError();
  }

  if (blob.size > SCANNER_LIMITS.maxZipSizeBytes) {
    throw new GitHubImportError('GitHub repository ZIP is too large for local scanning. Please download a smaller ZIP or remove generated folders before uploading manually.');
  }

  step(callbacks, 1, 28, true);

  const fileName = `${parsed.owner}-${parsed.repo}${branch ? `-${branch.replace(/[^A-Za-z0-9_.-]+/g, '-')}` : ''}.zip`;
  return {
    file: new File([blob], fileName, { type: 'application/zip' }),
    source: {
      sourceType: 'github-public',
      githubOwner: parsed.owner,
      githubRepo: parsed.repo,
      githubBranch: branch,
      sourceUrl: branch ? `https://github.com/${parsed.owner}/${parsed.repo}/tree/${branch}` : parsed.normalizedUrl,
    },
  };
}
