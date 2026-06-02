# Security Policy

ShipSeal is a local-first demo MVP for repository readiness scanning.

## No Code Execution

ShipSeal does not execute uploaded or imported repository code. The scanner reads ZIP metadata, filenames, sizes, and a bounded subset of small text/config files such as `package.json`, `README.md`, `.gitignore`, `.env.example`, and instruction files.

## Local Browser Scanning

The current MVP runs in the browser and has no backend, database, authentication, private repository access, external AI API calls, or server-side secret storage.

Public GitHub import attempts to fetch public repository ZIP archives from the browser. If browser import fails, users should download the ZIP manually from GitHub and upload it.

## Secrets

Do not intentionally upload real secrets, production credentials, customer data, or private keys.

ShipSeal detects suspicious credential files by path and filename, including examples such as `.env`, `.env.local`, private key files, `.pem`, `.key`, `credentials.json`, and `serviceAccount.json`. `.env.example` is treated as safe placeholder documentation.

## Responsible Disclosure

For responsible disclosure, contact: security@example.com

Replace this placeholder contact before any production launch.

## Future Hardening

Future backend or worker implementations should add isolated scanning workers, malware checks, strict retention, audit logging, least-privilege GitHub App access, server-side secret management, and redaction controls before handling private repositories.
