# ShipSeal

ShipSeal is an AI Project Delivery Pack Generator.

The current demo-ready MVP helps AI freelancers and agencies answer one practical question: is this project ready for a clear client handoff?

ShipSeal scans a repository ZIP or public GitHub repository, calculates a deterministic ShipSeal score, explains the go/no-go signal, identifies delivery risks, and generates a client-ready Delivery Pack with agent instructions, skills, MCP governance, eval and red-team tests, AI Act readiness notes, client handoff reports, repo context, and `score.json`.

ShipSeal analyzes repository structure and metadata. It does not execute uploaded or imported code.

## What Works Now

- ZIP upload scanning in the browser.
- Public GitHub repo import when browser ZIP fetch is available.
- Graceful manual ZIP fallback when GitHub import fails.
- Sample report for `sample-nextjs-app`.
- Deterministic readiness rule: score >= 85 and zero critical blockers.
- AI Readiness Narrative generated locally from scan metadata.
- ShipSeal Delivery Pack export.
- MCP governance outputs.
- Sanitized repo context preview/export.
- Full ZIP export with manifest-based Delivery Pack folders.
- Metadata-only recent scan history.

## Run Locally

```bash
npm install
npm run dev
```

Vite defaults to port `8080`. If that port is busy, Vite may choose another port.

## How To Run The ShipSeal MVP Demo

1. Run `npm install` and `npm run dev`.
2. Open the local Vite URL shown in the terminal.
3. Upload a small non-sensitive repository ZIP or use the sample report.
4. Fill the Project Intake fields with realistic client/project details.
5. Review the ShipSeal score, go/no-go status, risks, and Delivery Pack preview.
6. Click `Download ShipSeal Delivery Pack`.
7. Open the ZIP and review `06-client-handoff/CLIENT_HANDOFF_REPORT.md`, `04-testing/EVAL_TEST_CASES.md`, `04-testing/RED_TEAM_PROMPTS.md`, `05-ai-act-readiness/TRANSPARENCY_NOTICE_DRAFT.md`, and `score.json`.
8. Run `npm run test` and `npm run build` before sharing the demo.

For the full manual checklist, see [ShipSeal Demo Validation](docs/SHIPSEAL_DEMO_VALIDATION.md).

## Sample / Demo Output

ShipSeal includes a dogfooding sample for a realistic `Customer Support RAG Assistant`. The sample simulates an AI support app that answers questions from a knowledge base, is used in the EU, may handle personal data, generates user-facing AI answers, and has human escalation for uncertain or sensitive cases.

Use the sample to review the quality of the generated Delivery Pack without calling an external AI API or backend service. In the UI, run a normal scan or open the sample report, then click `Load demo project` in the Project Intake panel. Download the ShipSeal Delivery Pack and review the client handoff report, print-ready HTML report, AI Act readiness files, eval/red-team tests, skills pack, MCP governance notes, repo context, and `score.json`.

To review the print-ready report, click `Open print-ready report` in the Delivery Pack preview or open `06-client-handoff/CLIENT_HANDOFF_REPORT.html` from the downloaded ZIP. Use the browser print dialog and choose `Save as PDF` to create a PDF. Before sending it to a client, confirm the intake fields, score, risks, AI Act pre-screen, testing summary, next steps roadmap, and disclaimer are appropriate for the project.

The sample is intentionally not perfect. The generated pack should surface missing red-team documentation, transparency notice review, personal data/privacy review, MCP as a future governance item, and legal review recommendations. See [Sample Delivery Pack Review](docs/SAMPLE_DELIVERY_PACK_REVIEW.md) for the full review checklist.

## MVP Validation Offer

The first offer to validate is simple: ShipSeal turns an AI prototype or client automation repository into a client-ready Delivery Pack before handoff.

Target users are AI freelancers, small AI agencies, no-code/low-code AI builders, indie SaaS teams, and consultants delivering AI automations to clients. The pilot packages being tested are Free Preview, Starter Report at 49 EUR, Pro Agency Report at 149 EUR, and Founder-reviewed Audit at 499 EUR+.

To demo the offer, open the sample project, load the demo intake, download the Delivery Pack, and walk through the client handoff report, AI Act readiness files, eval/red-team tests, skills pack, MCP governance, and `score.json`.

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
- Agent instructions and skills pack
- MCP governance
- Eval and red-team tests
- AI Act readiness
- Client handoff report
- Repo context pack

### Test ZIP Upload

1. Export or create a small repository ZIP.
2. Open `Upload ZIP`.
3. Drop or select the ZIP.
4. Click `Analyze repository`.
5. Review the ShipSeal score, go/no-go status, risks, included Delivery Pack files, AI Act readiness, testing status, and client handoff preview.

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
- [Demo Validation](docs/SHIPSEAL_DEMO_VALIDATION.md)
- [Sample Delivery Pack Review](docs/SAMPLE_DELIVERY_PACK_REVIEW.md)
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
