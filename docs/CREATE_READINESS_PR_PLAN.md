# Create Readiness PR Plan

Create Readiness PR is the future ShipSeal workflow for proposing repository-ready files through a reviewed pull request.

The current MVP does not write to GitHub, request OAuth, ask for tokens, create branches, or open real pull requests. It previews the planned PR and lets users download the separate ShipSeal Readiness Fix Pack ZIP.

## Goal

Create Readiness PR should help users add ShipSeal-generated readiness files to their repository so future scans can detect stronger agent instructions, governance, testing, security, and client handoff signals.

## Why Pull Request, Not Main Branch Push

ShipSeal should not push directly to `main`.

A pull request is safer because:

- changes are isolated on a separate branch,
- humans can review every generated file,
- CI can run before merge,
- repository owners keep control,
- merge remains a human decision.

## Planned PR Data

- Branch name: `shipseal/readiness-pack`
- PR title: `Add ShipSeal readiness and agent governance pack`
- PR summary: `This pull request adds ShipSeal-generated agent instructions, governance notes, testing guidance, security review notes and client handoff documentation to improve AI project delivery readiness.`

## Files The PR May Add

- `AGENTS.md`
- `CLAUDE.md`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `docs/CRITICAL_FILES_POLICY.md`
- `docs/RELEASE_CHECKLIST.md`
- `docs/OWNERSHIP.md`
- `.github/workflows/ci.yml`

The downloadable Readiness Fix Pack may also include `docs/AGENT_CHANGE_POLICY.md`, `docs/HANDOFF_CHECKLIST.md`, and `docs/AI_ACT_READINESS_NOTES.md`.

## Readiness Areas

- AI agent instruction readiness
- Build, test & quality gates
- Security & secret handling
- Team workflow & governance
- Client handoff quality

These files are expected to improve future ShipSeal scans, depending on repository content and review. ShipSeal should not promise a guaranteed score increase.

## Future GitHub Permissions

A future implementation will need one of:

- GitHub OAuth with repository write permission approved by the user, or
- a GitHub App installation with scoped repository permissions.

Minimum future capabilities:

- read repository metadata,
- create a branch,
- create or update files on that branch,
- open a pull request.

The integration should not request broad organization access by default.

## Security Model

- No direct push to `main`.
- No automatic merge.
- No private repo support until explicit auth and permission boundaries are implemented.
- No token storage in the browser.
- No persistent storage of repository ZIPs or generated file contents unless a future product decision adds explicit storage.
- Generated files should be opened as a PR for human review.
- CI should run before merge.

## Manual Fallback In The MVP

Users can download `shipseal-readiness-fix-pack-[repo].zip` and apply it manually:

```bash
git checkout -b shipseal/readiness-pack

# unzip shipseal-readiness-fix-pack-[repo].zip into the repository root

git add AGENTS.md CLAUDE.md CONTRIBUTING.md SECURITY.md docs/ .github/workflows/ci.yml
git commit -m "Add ShipSeal readiness fix pack"
git push origin shipseal/readiness-pack
```

Then open a Pull Request on GitHub.

## Future Implementation Steps

1. Add GitHub OAuth or GitHub App flow.
2. Request scoped repo write permission.
3. Create `shipseal/readiness-pack` branch.
4. Upload generated readiness files to that branch.
5. Open a pull request with the planned title and summary.
6. Let the user review the PR.
7. Merge only after an explicit human decision.
