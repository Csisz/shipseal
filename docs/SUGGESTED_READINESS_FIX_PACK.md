# Suggested Readiness Fix Pack

The Suggested Readiness Fix Pack shows repository files that can improve ShipSeal readiness scoring, agent-readiness, governance, testing, security, and client handoff quality.

The feature is intentionally preview-first. It does not write to GitHub, does not request tokens, and does not create branches or pull requests in the current MVP.

## Why Not Write Directly To Main

Readiness files affect how humans and AI agents operate in a repository. Writing them directly to `main` would be risky because the repository owner should review:

- agent instructions,
- critical file rules,
- CI workflow behavior,
- security language,
- release checklist language,
- ownership and review policy.

## Why Future Pull Requests Are Safer

A future `Create Readiness PR` feature should create a separate branch and open a pull request for human review. That keeps changes visible, reviewable, reversible, and compatible with normal team workflows.

The current MVP prepares this by:

- generating suggested file mappings,
- showing a preview,
- allowing copy/download,
- explaining which readiness category each file improves.

## Suggested Files

- `AGENTS.md` - AI agent instruction readiness.
- `CLAUDE.md` - AI agent instruction readiness.
- `CONTRIBUTING.md` - team workflow and governance.
- `SECURITY.md` - security and secret handling.
- `docs/CRITICAL_FILES_POLICY.md` - governance and safety boundaries.
- `docs/RELEASE_CHECKLIST.md` - build, test and quality gates.
- `docs/OWNERSHIP.md` - ownership and review routing.
- `.github/workflows/ci.yml` - automated test/build verification.

## Future Create Readiness PR

Future version:

1. Generate suggested readiness files.
2. Create a separate branch.
3. Commit the suggested files.
4. Open a pull request.
5. Let the repository owner review, edit, and merge.

Not included now:

- GitHub OAuth.
- GitHub App.
- Private repository write access.
- Automatic PR creation.
- Main branch writes.
