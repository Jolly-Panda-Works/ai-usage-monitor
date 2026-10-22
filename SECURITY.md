# Security Policy

## Supported versions
Only the latest release receives fixes.

## Reporting a vulnerability
Please **do not** open a public issue. Use GitHub's private reporting:
<https://github.com/Jolly-Panda-Works/ai-usage-monitor/security/advisories/new>

Include steps to reproduce and the impact. You will get a response as soon as possible.

## Scope notes
The app listens on `127.0.0.1` for reports from the browser extension (per-account token), reads access tokens from the official apps' login files and holds pasted cookies in private browser storage (see [PRIVACY.md](PRIVACY.md)). Issues that could let other apps or websites read or spoof that data, leak the pairing tokens or cookies, or make the app write to the login files are especially important.
