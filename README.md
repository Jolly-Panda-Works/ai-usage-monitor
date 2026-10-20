<p align="center"><img src="assets/logo.png" width="120" alt="AI Usage Monitor logo"></p>

# AI Usage Monitor

**See how much of your Claude, ChatGPT, Gemini and Figma limits you have left — and exactly when they reset — for every account, in one window.**

[![Build](https://github.com/Jolly-Panda-Works/AIUsageMonitor/actions/workflows/build.yml/badge.svg)](https://github.com/Jolly-Panda-Works/AIUsageMonitor/actions/workflows/build.yml)
[![Latest release](https://img.shields.io/github/v/release/Jolly-Panda-Works/AIUsageMonitor?display_name=tag&color=F97316)](https://github.com/Jolly-Panda-Works/AIUsageMonitor/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/Jolly-Panda-Works/AIUsageMonitor/total?color=F97316)](https://github.com/Jolly-Panda-Works/AIUsageMonitor/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)](#download-and-install-windows)

[Download](https://github.com/Jolly-Panda-Works/AIUsageMonitor/releases/latest) · [Report a bug](https://github.com/Jolly-Panda-Works/AIUsageMonitor/issues/new?template=bug_report.yml) · [Request a feature](https://github.com/Jolly-Panda-Works/AIUsageMonitor/issues/new?template=feature_request.yml)

## Why?
If you use several AI accounts you constantly wonder: *which one still has quota, and when does the other one come back?* AI Usage Monitor answers that at a glance, with live countdowns and a Windows notification when an exhausted account becomes available again.

## Features
- Multiple accounts per service (e.g. several Claude accounts), each in its own isolated session.
- Used %, remaining % and a live **reset countdown** for every limit window (5-hour, weekly, …).
- Auto-refresh (configurable) and manual refresh.
- Windows notification when a limit resets.
- Dark-and-orange interface, **English and Persian (RTL)**.
- No telemetry; nothing leaves your PC except requests to the services you connect. See [PRIVACY.md](PRIVACY.md).

## Supported services
| Service | How usage is read | Notes |
| --- | --- | --- |
| **Claude** | claude.ai usage endpoint with your signed-in session | 5-hour and weekly windows; multiple accounts |
| **ChatGPT** | chatgpt.com usage endpoint with your signed-in session | Windows depend on your plan |
| **Gemini** | Manual counter | No public usage API for personal accounts |
| **Figma** | Manual counter | No public usage API for personal accounts |

> Claude and ChatGPT read **undocumented** website endpoints. They can change without notice; if one breaks, please [open an issue](https://github.com/Jolly-Panda-Works/AIUsageMonitor/issues/new?template=bug_report.yml). Results are percentages as reported by the service, not raw token counts.

## Download and install (Windows)
1. Open the [**Releases**](https://github.com/Jolly-Panda-Works/AIUsageMonitor/releases/latest) page.
2. Download `AI-Usage-Monitor-Setup-<version>.exe` (installer) or `AI-Usage-Monitor-Portable-<version>.exe` (no install).
3. Run it. Press **Add account**, choose a service, sign in, and close the sign-in window.

> **SmartScreen warning?** The app is not code-signed yet. Click **More info → Run anyway**. Verify downloads with `SHA256SUMS.txt` — see [CODE_SIGNING.md](CODE_SIGNING.md).

> Signing in with Google inside the app window may be blocked by Google. Use e-mail / magic-link sign-in if that happens.

## Run from source
Requirements: **Node.js 20+**.
```
git clone https://github.com/Jolly-Panda-Works/AIUsageMonitor.git
cd AIUsageMonitor
npm install
npm start
```

## Build the installer yourself
**GitHub Actions (recommended).** Push to `main` — the workflow builds on `windows-latest` and attaches the `.exe` files to the run. Push a tag (`git tag v1.1.0 && git push --tags`) to also publish a GitHub Release with `SHA256SUMS.txt`.

**Locally on Windows.** `npm install && npm run dist` → files appear in `dist/`.

## Project structure
```
AIUsageMonitor/
├── src/
│   ├── main.js          # Electron main process: windows, sessions, refresh timer
│   ├── preload.js       # safe bridge to the UI
│   ├── providers.js     # one fetcher per service
│   ├── renderer.js      # UI logic + English/Persian strings
│   ├── index.html
│   └── styles.css
├── assets/              # logo.svg / logo.png / icon.ico
├── .github/             # CI, release workflow, issue & PR templates, Dependabot
├── CHANGELOG.md  CONTRIBUTING.md  CODE_OF_CONDUCT.md
├── SECURITY.md  PRIVACY.md  CODE_SIGNING.md  LICENSE
└── package.json
```

## Limitations
- Unofficial endpoints (Claude, ChatGPT) may break when the websites change.
- Gemini and Figma need manual counting.
- Windows only for packaged builds; no code signing yet.

## Troubleshooting
| Problem | Fix |
| --- | --- |
| "Not signed in or the session expired" | Press **Sign in / Connect** and log in again. |
| ChatGPT shows "Connected, but no usage data" | Your plan may not expose usage; open an issue with your plan type. |
| Google sign-in is rejected | Use e-mail / magic-link sign-in instead. |
| "Windows protected your PC" | **More info → Run anyway**; see [CODE_SIGNING.md](CODE_SIGNING.md). |

## Contributing
Contributions are welcome — read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). Vulnerabilities: see [SECURITY.md](SECURITY.md).

## Responsible use
Use the app only with your own accounts and respect each service's terms of use. The app is not affiliated with Anthropic, OpenAI, Google or Figma. The authors are not responsible for misuse.

## License
Released under the [MIT License](LICENSE) © 2026 [Usef Farahmand](https://useffarahmand.com) · Jolly Panda Studio.

## Acknowledgments
[Electron](https://www.electronjs.org/) · [electron-builder](https://www.electron.build/)
