import type { IncomingMessage, ServerResponse } from 'node:http';
import { createSign } from 'node:crypto';

type QueryValue = string | string[] | undefined;
type VercelLikeRequest = IncomingMessage & {
  query?: Record<string, QueryValue>;
};

interface GitHubAppServerConfig {
  appId: string;
  privateKey: string;
}

interface RepositoryListOptions {
  fetcher?: typeof fetch;
  now?: () => Date;
  env?: NodeJS.ProcessEnv;
}

function firstValue(value: QueryValue) {
  return Array.isArray(value) ? value[0] : value;
}

function queryFromRequest(req: VercelLikeRequest) {
  if (req.query) return req.query;
  const parsed = new URL(req.url || '/', 'https://shipseal.local');
  return {
    installationId: parsed.searchParams.get('installationId') || undefined,
  };
}

function sendJson(res: ServerResponse, status: number, payload: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

function getServerConfig(env: NodeJS.ProcessEnv = process.env): GitHubAppServerConfig | null {
  const appId = (env.GITHUB_APP_ID || '').trim();
  const privateKey = normalizePrivateKey(env.GITHUB_APP_PRIVATE_KEY || '');
  if (!appId || !privateKey) return null;
  return { appId, privateKey };
}

function normalizePrivateKey(value: string) {
  return value.trim().replace(/\\n/g, '\n');
}

function base64url(value: string | Buffer) {
  return Buffer.from(value).toString('base64url');
}

export function createGitHubAppJwt(config: GitHubAppServerConfig, now = () => new Date()) {
  const timestamp = Math.floor(now().getTime() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iat: timestamp - 60,
    exp: timestamp + 9 * 60,
    iss: config.appId,
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(payload))}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  return `${unsigned}.${signer.sign(config.privateKey, 'base64url')}`;
}

export async function listInstallationRepositories(
  installationId: string,
  options: RepositoryListOptions = {}
) {
  if (!/^[0-9]+$/.test(installationId)) {
    return {
      status: 400,
      body: {
        status: 'invalid_request',
        message: 'A valid installationId query parameter is required.',
      },
    };
  }

  const config = getServerConfig(options.env);
  if (!config) {
    return {
      status: 501,
      body: {
        status: 'not_configured',
        message: 'GitHub App server credentials are not configured yet.',
      },
    };
  }

  const fetcher = options.fetcher || fetch;
  const jwt = createGitHubAppJwt(config, options.now);
  const tokenResponse = await fetcher(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!tokenResponse.ok) {
    return {
      status: tokenResponse.status === 404 ? 404 : 502,
      body: {
        status: 'github_error',
        message: tokenResponse.status === 404
          ? 'GitHub App installation was not found.'
          : 'GitHub App installation token request failed.',
      },
    };
  }

  const tokenPayload = await tokenResponse.json() as { token?: string };
  if (!tokenPayload.token) {
    return {
      status: 502,
      body: {
        status: 'github_error',
        message: 'GitHub App installation token response was missing a token.',
      },
    };
  }

  const reposResponse = await fetcher('https://api.github.com/installation/repositories', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokenPayload.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!reposResponse.ok) {
    return {
      status: 502,
      body: {
        status: 'github_error',
        message: 'GitHub App repository listing failed.',
      },
    };
  }

  const payload = await reposResponse.json() as { repositories?: Array<Record<string, unknown>> };
  const repositories = (payload.repositories || []).map(repo => {
    const owner = repo.owner && typeof repo.owner === 'object' ? repo.owner as Record<string, unknown> : {};
    return {
      owner: typeof owner.login === 'string' ? owner.login : '',
      name: typeof repo.name === 'string' ? repo.name : '',
      fullName: typeof repo.full_name === 'string' ? repo.full_name : '',
      defaultBranch: typeof repo.default_branch === 'string' ? repo.default_branch : undefined,
      private: repo.private === true,
      htmlUrl: typeof repo.html_url === 'string' ? repo.html_url : '',
    };
  }).filter(repo => repo.owner && repo.name && repo.fullName);

  return {
    status: 200,
    body: {
      status: 'ok',
      repositories,
    },
  };
}

export default async function handler(req: VercelLikeRequest, res: ServerResponse) {
  const installationId = (firstValue(queryFromRequest(req).installationId) || '').trim();
  const result = await listInstallationRepositories(installationId);
  sendJson(res, result.status, result.body);
}
