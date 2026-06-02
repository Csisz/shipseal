import type { AgentPackFile, MCPPolicyFile } from '../types';
import { normalizeProjectIntake } from '../intake';
import type { PartialProjectIntake, ProjectIntake } from '../intake';
import { generateAiActReadinessFiles } from './aiActReadiness';
import { generateTestingPackFiles } from './testingPack';
import { generateSkillsPackFiles } from './skillsPack';
import { generateClientHandoffFiles } from './clientHandoff';
import {
  SHIPSEAL_DELIVERY_PACK_MANIFEST,
  getDeliveryPackFileContracts,
} from './manifest';
import type { DeliveryPackGeneratedFile, DeliveryPackManifest } from './types';

export interface BuildDeliveryPackFilesInput {
  agentFiles: AgentPackFile[];
  mcpFiles?: MCPPolicyFile[];
  contextFiles?: { markdown: string; json: unknown };
  repositoryName?: string;
  scoreJson?: unknown;
  intake?: PartialProjectIntake;
  manifest?: DeliveryPackManifest;
}

export function buildDeliveryPackFiles(input: BuildDeliveryPackFilesInput): DeliveryPackGeneratedFile[] {
  const manifest = input.manifest || SHIPSEAL_DELIVERY_PACK_MANIFEST;
  const projectName = resolveProjectName(input);
  const intake = normalizeProjectIntake(input.intake, projectName);
  const agentFileByName = new Map(input.agentFiles.map(file => [file.name, file]));
  const mcpFileByName = new Map((input.mcpFiles || []).map(file => [file.filename, file]));

  return getDeliveryPackFileContracts(manifest).map(fileContract => {
    const sourceContent = resolveSourceContent(fileContract.path, fileContract.filename, {
      agentFileByName,
      mcpFileByName,
      contextFiles: input.contextFiles,
      intake,
      scoreJson: input.scoreJson,
    });

    return {
      path: fileContract.path,
      kind: fileContract.kind,
      content: fileContract.kind === 'json'
        ? withJsonMetadata(sourceContent, projectName, fileContract.path)
        : withTextHeader(sourceContent, projectName, fileContract.path, fileContract.kind),
    };
  });
}

function resolveProjectName(input: BuildDeliveryPackFilesInput): string {
  if (input.intake?.projectName?.trim()) return input.intake.projectName.trim();
  if (input.repositoryName?.trim()) return input.repositoryName.trim();

  const scoreRepositoryName = objectValue(input.scoreJson, 'repositoryName');
  if (scoreRepositoryName) return scoreRepositoryName;

  const contextRepositoryName = objectValue(input.contextFiles?.json, 'repositoryName');
  if (contextRepositoryName) return contextRepositoryName;

  return 'repository';
}

function objectValue(value: unknown, key: string): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const record = value as Record<string, unknown>;
  return typeof record[key] === 'string' && record[key].trim() ? record[key].trim() : undefined;
}

function resolveSourceContent(
  path: string,
  filename: string,
  input: {
    agentFileByName: Map<string, AgentPackFile>;
    mcpFileByName: Map<string, MCPPolicyFile>;
    contextFiles?: { markdown: string; json: unknown };
    intake: ProjectIntake;
    scoreJson?: unknown;
  }
): string | unknown {
  const projectName = input.intake.projectName;
  const aiActFiles = generateAiActReadinessFiles(input.intake);
  const testingPackFiles = generateTestingPackFiles(input.intake, input.agentFileByName.get('TESTING_STRATEGY.md')?.content);
  const skillsPackFiles = generateSkillsPackFiles(input.intake);
  const clientHandoffFiles = generateClientHandoffFiles(input.intake, input.scoreJson);

  if (path.startsWith('01-agent-instructions/')) {
    return input.agentFileByName.get(filename)?.content || markdownPlaceholder(filename, projectName, [
      'This agent instruction file is reserved in the ShipSeal MVP Delivery Pack contract.',
      'Replace it with repository-specific guidance when the dedicated generator is enabled.',
    ]);
  }

  if (path.startsWith('02-skills/')) {
    return skillsPackFiles[path as keyof typeof skillsPackFiles] || markdownPlaceholder(filename, projectName, [
      'This skill file is reserved in the ShipSeal Delivery Pack contract.',
    ]);
  }

  if (path.startsWith('03-mcp-governance/')) {
    return input.mcpFileByName.get(filename)?.content || markdownPlaceholder(filename, projectName, [
      'This MCP governance file is reserved in the ShipSeal MVP Delivery Pack contract.',
      'Use read-only defaults and human approval for high-risk tool access.',
    ]);
  }

  if (path === '04-testing/TESTING_STRATEGY.md') {
    return testingPackFiles.testingStrategy;
  }

  if (path === '04-testing/CI_QUALITY_GATE.yml') {
    return input.agentFileByName.get('CI_QUALITY_GATE.yml')?.content || ciPlaceholder(projectName);
  }

  if (path === '04-testing/EVAL_TEST_CASES.md') return testingPackFiles.evalTestCases;
  if (path === '04-testing/RED_TEAM_PROMPTS.md') return testingPackFiles.redTeamPrompts;

  if (path === '05-ai-act-readiness/AI_ACT_READINESS_CHECKLIST.md') return aiActFiles.checklist;
  if (path === '05-ai-act-readiness/TRANSPARENCY_NOTICE_DRAFT.md') return aiActFiles.transparencyNotice;
  if (path === '05-ai-act-readiness/LEGAL_REVIEW_QUESTIONS.md') return aiActFiles.legalReviewQuestions;
  if (path === '06-client-handoff/CLIENT_HANDOFF_REPORT.md') return clientHandoffFiles.clientHandoffReport;
  if (path === '06-client-handoff/EXECUTIVE_SUMMARY.md') return clientHandoffFiles.executiveSummary;
  if (path === '06-client-handoff/NEXT_STEPS_ROADMAP.md') return clientHandoffFiles.nextStepsRoadmap;

  if (path === '07-context/REPO_CONTEXT_PACK.md') {
    return input.contextFiles?.markdown || markdownPlaceholder('REPO_CONTEXT_PACK.md', projectName, [
      'No repo context pack was available for this export.',
      'The file is present to preserve the ShipSeal Delivery Pack contract.',
    ]);
  }

  if (path === '07-context/repo-context-pack.json') {
    return input.contextFiles?.json || { repositoryName: projectName, contextAvailable: false };
  }

  if (path === 'score.json') {
    return input.scoreJson || { repositoryName: projectName, scoreAvailable: false };
  }

  return markdownPlaceholder(filename, projectName, [
    'This file is reserved in the ShipSeal MVP Delivery Pack contract.',
  ]);
}

function withTextHeader(content: string | unknown, projectName: string, path: string, kind: 'markdown' | 'yaml') {
  const text = typeof content === 'string' ? content.trim() : JSON.stringify(content, null, 2);
  const header = kind === 'yaml'
    ? [
        `# ShipSeal Delivery Pack - ${path}`,
        `# Project: ${projectName}`,
        '# Generated by ShipSeal.',
        '',
      ]
    : [
        `# ShipSeal Delivery Pack - ${path}`,
        '',
        `Project: ${projectName}`,
        '',
        'Generated by ShipSeal.',
        '',
      ];

  return `${header.join('\n')}${text || fallbackText(path, projectName)}`;
}

function withJsonMetadata(content: string | unknown, projectName: string, path: string) {
  const value = typeof content === 'string' ? safeJsonParse(content) : content;
  const payload = {
    product: 'ShipSeal',
    title: `ShipSeal Delivery Pack - ${path}`,
    projectName,
    generatedBy: 'Generated by ShipSeal',
    content: value ?? {},
  };

  return `${JSON.stringify(payload, null, 2)}\n`;
}

function safeJsonParse(content: string): unknown {
  try {
    return JSON.parse(content);
  } catch {
    return { text: content };
  }
}

function fallbackText(path: string, projectName: string) {
  return `ShipSeal placeholder for ${projectName}: ${path}.`;
}

function markdownPlaceholder(title: string, projectName: string, bullets: string[]) {
  return [
    `# ${title} - ${projectName}`,
    '',
    'Generated by ShipSeal.',
    '',
    '## Purpose',
    ...bullets.map(bullet => `- ${bullet}`),
    '',
  ].join('\n');
}

function ciPlaceholder(projectName: string) {
  return [
    `# ShipSeal CI quality gate for ${projectName}`,
    '# Generated by ShipSeal.',
    'name: ShipSeal Quality Gate',
    'on:',
    '  pull_request:',
    'jobs:',
    '  quality:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    '      - uses: actions/checkout@v4',
    '      - run: echo "Configure project-specific ShipSeal verification commands"',
    '',
  ].join('\n');
}
