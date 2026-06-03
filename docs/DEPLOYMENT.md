# AgentReady Deployment

AgentReady can be deployed as a static React/Vite application on Vercel or Netlify.

## Build Settings

- Build command: `npm run build`
- Output directory: `dist`
- Environment variables: none required for the current local-only MVP

## Vercel

1. Import the repository into Vercel.
2. Select the Vite framework preset if prompted.
3. Set build command to `npm run build`.
4. Set output directory to `dist`.
5. Do not add OpenAI, Anthropic, GitHub, or private API keys to client-side environment variables.
6. Deploy.

## Netlify

1. Import the repository into Netlify.
2. Set build command to `npm run build`.
3. Set publish directory to `dist`.
4. Leave environment variables empty for the current MVP.
5. Deploy.

## Security Notes

- The current MVP has no backend.
- No API keys are required.
- No external AI API calls are made.
- Uploaded/imported code is not executed.
- Recent scan history stores metadata only in browser localStorage.

## GitHub Import Limitations

Public GitHub import attempts browser ZIP downloads from GitHub. Browser import may fail because of CORS, network policy, repository availability, branch naming, or ZIP size limits. The supported local fallback is to download the repository as ZIP and upload it manually.

A Vercel hosted demo can use the same-origin serverless proxy at `/api/github-archive?owner=Csisz&repo=shipseal&ref=main`. Static-only hosts without an equivalent function should keep ZIP upload as the main demo path; see [GitHub Import Proxy Plan](GITHUB_IMPORT_PROXY_PLAN.md).

Private repositories require a future backend/GitHub App integration. Do not add user-pasted tokens or private credentials to the browser.

## Manual QA After Deploy

- Open the landing page.
- View the sample report.
- Upload a valid ZIP.
- Upload an invalid ZIP and confirm the friendly error.
- Try a public GitHub import and confirm either success or graceful fallback.
- Export the Agent Pack ZIP.
- Export `score.json`.
- Check mobile width.
- Check the browser console for obvious runtime errors.
- Confirm footer shows `AgentReady MVP v0.1.0-rc1`.
