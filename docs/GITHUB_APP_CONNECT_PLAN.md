# GitHub App Connect Plan

ShipSeal's ideal production source flow should be:

Connect GitHub -> select repository -> scan -> generate Delivery Pack -> create Readiness PR.

The current MVP keeps temporary token mode for developer testing only. The recommended user flow starts at repository source selection, before scan/import, so the same GitHub connection can later support Pull Request creation.

## Repository Source Modes

- GitHub App connected repo: scan + PR creation for the selected repository.
- Public GitHub URL: public archive scan + export; PR creation requires connecting GitHub later.
- ZIP upload: local/browser scan + export; PR creation requires connecting GitHub later or using developer token fallback.

Shared connection state lives in `src/lib/githubConnection/types.ts` and tracks source mode, owner, repo, default branch, installation id, repository listing capability, and PR creation capability.

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

1. User chooses repository source.
2. User clicks Connect GitHub.
3. User installs or authorizes the ShipSeal GitHub App.
4. GitHub redirects to the callback URL.
5. Backend stores installation id/session only.
6. Backend requests an installation access token server-side.
7. UI lists accessible repositories.
8. User selects a repository.
9. ShipSeal scans the repository archive.
10. User previews generated readiness files.
11. ShipSeal creates a branch and opens a Pull Request.

## Security Rules

- Do not store user PAT tokens.
- Keep installation access tokens short-lived and server-side.
- Limit access to selected repositories.
- Never push directly to `main`.
- PR only; no automatic merge.
- Show a separate warning when a workflow file will be created or changed.
- Add an audit log later for connect, scan, branch creation, file writes, and PR creation events.

## Vercel Environment Variables

Frontend MVP configuration:

- `VITE_GITHUB_APP_SLUG`
- `VITE_GITHUB_APP_NAME`
- `VITE_GITHUB_APP_INSTALL_URL`

If `VITE_GITHUB_APP_INSTALL_URL` is set, ShipSeal opens that URL when the user clicks `Connect GitHub`. If it is not set but `VITE_GITHUB_APP_SLUG` is present, the frontend builds:

```text
https://github.com/apps/{slug}/installations/new
```

If neither value is configured, the `Connect GitHub` button stays disabled and the UI explains that GitHub App install is not configured in this demo.

Planned production configuration:

- `GITHUB_APP_ID`
- `GITHUB_APP_PRIVATE_KEY`
- `GITHUB_APP_CLIENT_ID`
- `GITHUB_APP_CLIENT_SECRET`
- `GITHUB_APP_WEBHOOK_SECRET`
- `GITHUB_APP_CALLBACK_URL`

The server-side values are documented for the next milestone. The current MVP does not exchange callback codes, generate installation tokens, store sessions, or list repositories from GitHub.

## Create a GitHub App For Local/Demo Testing

Use GitHub Developer settings to create a demo app:

1. Open GitHub Developer settings.
2. Create a new GitHub App.
3. Set App name to something like `ShipSeal Demo`.
4. Set Homepage URL to the Vercel demo URL or local development URL.
5. Set Callback URL to the future callback endpoint, for example `https://your-demo.vercel.app/api/github-app/callback` or `http://localhost:8080/api/github-app/callback` for local experiments.
6. Configure repository permissions:
   - Metadata: read
   - Contents: read/write
   - Pull requests: read/write
   - Workflows: read/write, optional and only needed if ShipSeal writes CI workflow files
7. Install only on selected repositories.
8. Copy the app slug from the GitHub App URL and set `VITE_GITHUB_APP_SLUG`.
9. Optionally set `VITE_GITHUB_APP_INSTALL_URL` if the demo should use a fixed install URL.

For Vercel demo testing, add the frontend env vars in Vercel Project Settings -> Environment Variables, then redeploy. Add the server-side GitHub App env vars later when callback handling and repository listing are implemented.

## MVP Skeleton Endpoints

The current codebase reserves these API route locations:

- `GET /api/github-app/start`
- `GET /api/github-app/callback`
- `GET /api/github-app/repositories`

They intentionally return `501 not_implemented` until the real GitHub App installation, callback, session, repository listing, and installation token logic is built.

The next milestone should turn the callback into repository listing by storing installation/session state, generating an installation access token server-side, and returning repositories available to the selected installation.
