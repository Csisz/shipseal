# Suggested Readiness Fix Pack

The Suggested Readiness Fix Pack shows repository files that can improve ShipSeal readiness scoring, agent-readiness, governance, testing, security, and client handoff quality.

The feature is intentionally preview-first. It does not write to GitHub, does not request tokens, and does not create branches or pull requests in the current MVP. Users can download a separate `shipseal-readiness-fix-pack-[repo].zip` and copy those files into the repository root.

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
- exporting a separate Readiness Fix Pack ZIP,
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

Optional MVP files may include:

- `docs/AGENT_CHANGE_POLICY.md` - AI agent change boundaries.
- `docs/HANDOFF_CHECKLIST.md` - client handoff review checklist.
- `docs/AI_ACT_READINESS_NOTES.md` - preliminary technical AI Act readiness notes, not legal advice.

## Manual Git Fallback

```bash
git checkout -b shipseal/readiness-pack

# unzip shipseal-readiness-fix-pack-[repo].zip into the repository root

git add AGENTS.md CLAUDE.md CONTRIBUTING.md SECURITY.md docs/ .github/workflows/ci.yml
git commit -m "Add ShipSeal readiness fix pack"
git push origin shipseal/readiness-pack
```

Then open a Pull Request on GitHub.

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
