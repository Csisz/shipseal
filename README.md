# ShipSeal

ShipSeal is an AI Project Delivery Pack Generator.

The current demo-ready MVP helps teams answer one practical question: can this repository be safely handed to AI coding agents with the right delivery context?

ShipSeal scans a repository ZIP or public GitHub repository, calculates a deterministic Agent Readiness Score, identifies critical blockers, and generates practical handoff artifacts: Agent Pack, MCP Governance Pack, Repo Context Pack, and `score.json`.

ShipSeal analyzes repository structure and metadata. It does not execute uploaded or imported code.

## What Works Now

- ZIP upload scanning in the browser.
- Public GitHub repo import when browser ZIP fetch is available.
- Graceful manual ZIP fallback when GitHub import fails.
- Sample report for `sample-nextjs-app`.
- Deterministic readiness rule: score >= 85 and zero critical blockers.
- AI Readiness Narrative generated locally from scan metadata.
- Agent Pack export.
- MCP Governance Pack export.
- Sanitized Repo Context Pack preview/export.
- Full ZIP export with core files, `mcp-governance/`, and `context/`.
- Metadata-only recent scan history.

## Run Locally

```bash
npm install
npm run dev
```

Vite defaults to port `8080`. If that port is busy, Vite may choose another port.

## Validate Locally

```bash
npm run test
npm run build
npm run lint
```

Known non-blocking lint warnings: shadcn/ui fast-refresh warnings in shared UI component files.

## Try The Demo

### View Sample Report

Click `View sample report` on the landing page. The sample demonstrates:

- `sample-nextjs-app`
- score `92`
- `AI Coding Ready`
- zero critical blockers
- Next.js / React / TypeScript stack
- Agent Pack files
- MCP Governance Pack
- Repo Context Pack

### Test ZIP Upload

1. Export or create a small repository ZIP.
2. Open `Upload ZIP`.
3. Drop or select the ZIP.
4. Click `Analyze repository`.
5. Review score, blockers, Scanner safety, Agent Pack, MCP Readiness, and Repo Context Pack.

### Test GitHub Public Import

1. Open `Import from GitHub`.
2. Paste a public URL such as `https://github.com/owner/repo`.
3. Optionally enter a branch.
4. Click `Import public repo`.

Limitations:

- Public repositories only.
- No tokens, credentials, OAuth, or private repo access.
- Browser ZIP fetch may fail due to CORS, network policy, repo availability, branch names, or ZIP size.
- If import fails, download the ZIP from GitHub and upload it manually.

## Architecture

ShipSeal is a React/Vite/shadcn application with local-first scanning.

- `src/lib/scanEngine/`: scan engine boundary and local implementation.
- `src/lib/github/`: public GitHub URL parsing and ZIP import helper.
- `src/lib/scanner.ts`: JSZip-based metadata scanner.
- `src/lib/scoring.ts`: deterministic readiness scoring.
- `src/lib/ai/`: local deterministic AI provider boundary.
- `src/lib/agentPack.ts`: Agent Pack generation.
- `src/lib/mcpReadiness.ts`: MCP readiness and governance pack generation.
- `src/lib/repoContextPack.ts`: sanitized Repo Context Pack generation.
- `src/lib/exports.ts`: `score.json`, file downloads, and ZIP exports.
- `src/lib/scanHistory.ts`: metadata-only local scan history.

## Docs

- [Architecture](docs/ARCHITECTURE.md)
- [Production Roadmap](docs/PRODUCTION_ROADMAP.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Release Checklist](docs/RELEASE_CHECKLIST.md)
- [Demo Script](docs/DEMO_SCRIPT.md)
- [Sample Repos](docs/SAMPLE_REPOS.md)

## Current Limitations

- No backend worker.
- No database or authentication.
- No payments.
- No private repo access or GitHub App integration.
- No external AI API calls.
- No browser API keys.
- Scan cancellation is best-effort while JSZip work is in progress.
- Main readiness and MCP readiness are heuristic and deterministic.

## Security Note

Uploaded/imported code is never executed. ShipSeal reads filenames, sizes, and selected small text/config files such as `package.json`, `README.md`, `.gitignore`, and instruction files. Secret-looking files are flagged by path. Raw uploaded file contents, downloaded ZIPs, generated packs, and full context packs are not stored in local scan history.
