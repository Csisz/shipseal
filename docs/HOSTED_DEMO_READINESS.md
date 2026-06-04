# ShipSeal Hosted Demo Readiness

This checklist is for preparing a public, hosted ShipSeal MVP demo on Vercel, Netlify, or a similar static hosting platform.

## Local Run

Frontend-only Vite dev:

```bash
npm install
npm run test
npm run build
npm run dev
```

Open the local Vite URL shown in the terminal. The default local URL is usually `http://localhost:8080`.

Vercel dev with API routes:

```bash
vercel dev
```

Use `vercel dev` when testing `/api/github-archive`, `/api/create-readiness-pr`, and `/api/audit-request` together with the frontend.

If `vercel dev` opens a white page and the console shows `GET /src/main.tsx 404`, `GET /@vite/client 404`, or `GET /@react-refresh 404`, Vercel is serving the root `index.html` as a static file instead of proxying the Vite dev server. Check that `vercel.json` uses `framework: "vite"` and `devCommand: "vite --host 0.0.0.0 --port $PORT"`.

## Environment Variables

No environment variables are required for the core local-first scan/export demo.

Optional:

- `CONTACT_WEBHOOK_URL`: used by `POST /api/audit-request` to forward founder-reviewed audit requests to a configured webhook.

If `CONTACT_WEBHOOK_URL` is configured, the in-app audit request form validates the payload and forwards it server-side. If it is not configured, the form still validates input but the endpoint returns `503` with `Audit request form is not configured yet.`

Set the variable in Vercel Dashboard -> Project Settings -> Environment Variables. Redeploy Production after changing it.

Do not add OpenAI, Anthropic, GitHub, Stripe, or private API keys to the client-side app. The current demo does not need client-side secrets.

## Vercel Demo Deployment

1. Import the repository into Vercel.
2. Use the default Vite settings:
   - Build command: `npm run build`
   - Output directory: `dist`
3. Keep `vercel.json`; it sets the Vite framework preset, `devCommand`, API route handling, and SPA fallback.
4. Leave environment variables empty for scan/export-only demos, or set `CONTACT_WEBHOOK_URL` if the audit request form should forward requests.
5. Deploy. Vercel should also expose the serverless endpoint at `/api/github-archive`.
6. After deployment, run the manual demo checks below and [Hosted Smoke Test](HOSTED_SMOKE_TEST.md).

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
- Public GitHub URL import through the Vercel same-origin archive proxy in hosted demos.
- Direct public GitHub URL import when browser/network rules allow fetching the public ZIP.
- Project Intake form.
- Founder-reviewed audit request form validation. Sending requires optional `CONTACT_WEBHOOK_URL`.
- ShipSeal score and preview UI.
- Delivery Pack ZIP export.
- Print-ready HTML client report.
- Browser Print / Save as PDF from the standalone HTML report.
- Metadata-only local recent scan history.

## Not Supported Yet

- Private repositories.
- Authentication.
- Payment or Stripe checkout.
- CRM integration.
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
4. Click `Download PDF report`, then use `Open HTML report` as the Print / Save as PDF fallback if needed.
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
- Public GitHub import is best-effort in the browser. ZIP upload is the recommended fallback for local demos.
- A hosted Vercel public GitHub import can use the same-origin serverless proxy `/api/github-archive?owner=Csisz&repo=shipseal&ref=main`. See [GitHub Import Proxy Plan](GITHUB_IMPORT_PROXY_PLAN.md).
- Static hosts without an equivalent function should use ZIP upload for demos.

## Final Hosted Demo Checklist

- `npm run test` passes locally.
- `npm run build` passes locally.
- Hosted landing page loads.
- Footer shows `ShipSeal MVP v0.1.0-rc1`.
- Sample project opens.
- ZIP upload scan works.
- On Vercel, `/api/github-archive?owner=Csisz&repo=shipseal&ref=main` returns a ZIP response for a public repo.
- Public GitHub URL import succeeds through the proxy or fails with a clear ZIP fallback message.
- Delivery Pack ZIP downloads.
- `CLIENT_HANDOFF_REPORT.html` opens and can be saved as PDF from the browser.
