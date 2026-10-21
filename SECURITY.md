# Security Policy

## Supported versions
Only the latest release receives fixes.

## Reporting a vulnerability
Please **do not** open a public issue. Use GitHub's private reporting:
<https://github.com/Jolly-Panda-Works/ai-usage-monitor/security/advisories/new>

Include steps to reproduce and the impact. You will get a response as soon as possible.

## Scope notes
The optional browser extension delivers usage numbers to the app on `127.0.0.1` with a per-account token; issues that let other apps or websites read or spoof that data, or leak the pairing tokens, are especially important. Each account's sign-in session lives in its own isolated Electron session inside the app, and the optional cookie sign-in stores a pasted cookie there (see [PRIVACY.md](PRIVACY.md)). Issues that could expose or mix up those sessions, leak cookies, or let a web page loaded in a sign-in window reach the app's own window or files are especially important.
