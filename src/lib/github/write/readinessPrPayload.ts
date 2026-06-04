import type { ReadinessReport } from '@/lib/types';
import { buildSuggestedReadinessFixPack } from '@/lib/readinessFixPack';
import { buildReadinessPrPlan } from '@/lib/readinessPr';
import { parseGitHubUrl } from '@/lib/github/parseGitHubUrl';
import type { CreateReadinessPrFilePayload, CreateReadinessPrPayload } from './types';

export interface ReadinessPrPayloadInput {
  report: ReadinessReport;
  githubToken: string;
  owner?: string;
  repo?: string;
  baseBranch?: string;
}

export function buildCreateReadinessPrPayload({
  report,
  githubToken,
  owner,
  repo,
  baseBranch,
}: ReadinessPrPayloadInput): CreateReadinessPrPayload {
  const repoInfo = inferGitHubRepo(report, owner, repo);
  const plan = buildReadinessPrPlan();
  const files = buildSuggestedReadinessFixPack(report)
    .filter(file => isPrFile(file.path))
    .map<CreateReadinessPrFilePayload>(file => ({ path: file.path, content: file.content }));

  return {
    owner: repoInfo.owner,
    repo: repoInfo.repo,
    baseBranch: baseBranch || report.source.githubBranch || undefined,
    branchName: plan.branchName,
    prTitle: plan.title,
    prBody: `${plan.summary}\n\n${plan.safetyNote}\n\n${plan.expectedImpactNote}`,
    files,
    githubToken,
  };
}

export function inferGitHubRepo(report: ReadinessReport, owner?: string, repo?: string) {
  if (owner && repo) return { owner, repo };
  if (report.source.githubOwner && report.source.githubRepo) {
    return { owner: report.source.githubOwner, repo: report.source.githubRepo };
  }
  if (report.source.sourceUrl) {
    try {
      const parsed = parseGitHubUrl(report.source.sourceUrl);
      return { owner: parsed.owner, repo: parsed.repo };
    } catch {
      // Fall through to empty values for UI validation.
    }
  }
  return { owner: owner || '', repo: repo || '' };
}

function isPrFile(path: string) {
  return [
    'AGENTS.md',
    'CLAUDE.md',
    'CONTRIBUTING.md',
    'SECURITY.md',
    'docs/CRITICAL_FILES_POLICY.md',
    'docs/RELEASE_CHECKLIST.md',
    'docs/OWNERSHIP.md',
    '.github/workflows/ci.yml',
  ].includes(path);
}
