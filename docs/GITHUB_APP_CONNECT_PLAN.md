# GitHub App Connect Plan

ShipSeal's production GitHub flow should be:

Connect GitHub -> select repository -> scan -> generate Delivery Pack -> create Readiness PR.

The current MVP keeps temporary token mode for developer testing only. The recommended user flow should move to a GitHub App connection before private repository support or one-click PR creation becomes production-ready.

## Why GitHub App Instead Of Manual Tokens

A GitHub App is better than asking users to paste personal access tokens because:

- users can install ShipSeal on selected repositories instead of exposing broad account access,
- permissions are explicit and reviewable during installation,
- installation access tokens are generated server-side and short-lived,
- users can revoke the app installation from GitHub,
- ShipSeal does not need to store user PATs,
- the UI can list accessible repositories and create PRs without asking users to understand token scopes.

## Required GitHub App Permissions

Minimum planned permissions:

- Metadata: read
- Contents: read/write
- Pull requests: read/write

Optional permission:

- Workflows: read/write, only if ShipSeal writes `.github/workflows/ci.yml`

Workflow writes should stay visibly warned in the UI because CI workflow files are sensitive repository automation.

## Planned Flow

1. User clicks Connect GitHub.
2. User installs or authorizes the ShipSeal GitHub App.
3. GitHub redirects to the callback URL.
4. Backend stores installation id/session only.
5. Backend requests an installation access token server-side.
6. UI lists accessible repositories.
7. User selects a repository.
8. ShipSeal scans the repository archive.
9. User previews generated readiness files.
10. ShipSeal creates a branch and opens a Pull Request.

## Security Rules

- Do not store user PAT tokens.
- Keep installation access tokens short-lived and server-side.
- Limit access to selected repositories.
- Never push directly to `main`.
- PR only; no automatic merge.
- Show a separate warning when a workflow file will be created or changed.
- Add an audit log later for connect, scan, branch creation, file writes, and PR creation events.

## Vercel Environment Variables

Planned production configuration:

- `GITHUB_APP_ID`
- `GITHUB_APP_PRIVATE_KEY`
- `GITHUB_APP_CLIENT_ID`
- `GITHUB_APP_CLIENT_SECRET`
- `GITHUB_APP_WEBHOOK_SECRET`
- `GITHUB_APP_CALLBACK_URL`

## MVP Skeleton Endpoints

The current codebase reserves these API route locations:

- `GET /api/github-app/start`
- `GET /api/github-app/callback`
- `GET /api/github-app/repositories`

They intentionally return `501 not_implemented` until the real GitHub App installation, callback, session, repository listing, and installation token logic is built.
