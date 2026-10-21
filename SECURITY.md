# Security Policy

## Supported versions
Only the latest release receives fixes.

## Reporting a vulnerability
Please **do not** open a public issue. Use GitHub's private reporting:
<https://github.com/Jolly-Panda-Works/ai-usage-monitor/security/advisories/new>

Include steps to reproduce and the impact. You will get a response as soon as possible.

## Scope notes
The app receives usage numbers from the browser extension on `127.0.0.1` using a per-account token (see [PRIVACY.md](PRIVACY.md)). Issues that could let other apps or websites read or spoof that data, or leak the pairing tokens, are especially important.
