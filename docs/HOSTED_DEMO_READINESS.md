# ShipSeal Hosted Demo Readiness

This checklist is for preparing a public, hosted ShipSeal MVP demo on Vercel, Netlify, or a similar static hosting platform.

## Local Run

```bash
npm install
npm run test
npm run build
npm run dev
```

Open the local Vite URL shown in the terminal. The default local URL is usually `http://localhost:8080`.

## Environment Variables

No environment variables are required for the current local-first MVP.

Do not add OpenAI, Anthropic, GitHub, Stripe, or private API keys to the client-side app. The current demo does not need secrets.

## Vercel Demo Deployment

1. Import the repository into Vercel.
2. Use the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Leave environment variables empty unless a future sprint explicitly adds safe public config.
4. Deploy.
5. After deployment, run the manual demo checks below.

## Netlify Demo Deployment

1. Create a new Netlify site from the repository.
2. Use:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Leave environment variables empty.
4. Deploy.
5. After deployment, run the manual demo checks below.

## What Works Without A Backend

- Landing/pricing validation page.
- Sample project flow.
- ZIP upload scanning in the browser.
- Public GitHub URL import when browser/network rules allow fetching the public ZIP.
- Project Intake form.
- ShipSeal score and preview UI.
- Delivery Pack ZIP export.
- Print-ready HTML client report.
- Browser Print / Save as PDF from the standalone HTML report.
- Metadata-only local recent scan history.

## Not Supported Yet

- Private repositories.
- Authentication.
- Payment or Stripe checkout.
- Backend worker scanning.
- Server-side AI calls.
- Persistent server storage.
- Private GitHub App import.
- OAuth.
- Database-backed audit history.

## Demo Flow

1. Open the hosted URL.
2. Click `Try sample project`.
3. In Project Intake, click `Load demo project`.
4. Click `Open HTML report and save as PDF`, then use browser Print / Save as PDF if needed.
5. Click `Download ShipSeal Delivery Pack`.
6. Review `06-client-handoff/CLIENT_HANDOFF_REPORT.html` and `score.json`.
7. Return to the scan form and test ZIP upload.
8. Test public GitHub URL import with `https://github.com/Csisz/shipseal`.
9. If GitHub import fails because of CORS, browser, network, branch, size, or repository availability constraints, download the repository as ZIP and upload it manually.

## Public GitHub Import Notes

- Supported input examples:
  - `https://github.com/Csisz/shipseal`
  - `https://github.com/Csisz/shipseal.git`
  - `github.com/Csisz/shipseal`
- Optional branch input is supported when the branch name is known.
- If no branch is provided, ShipSeal requests the public GitHub archive for `HEAD`; GitHub resolves the repository default branch.
- Public GitHub import is best-effort in the browser. ZIP upload is the recommended fallback for demos.

## Final Hosted Demo Checklist

- `npm run test` passes locally.
- `npm run build` passes locally.
- Hosted landing page loads.
- Sample project opens.
- ZIP upload scan works.
- Public GitHub URL import succeeds or fails with a clear ZIP fallback message.
- Delivery Pack ZIP downloads.
- `CLIENT_HANDOFF_REPORT.html` opens and can be saved as PDF from the browser.
