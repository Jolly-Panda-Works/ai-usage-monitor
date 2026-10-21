<p align="center"><img src="assets/logo.png" width="120" alt="AI Usage Monitor logo"></p>

# AI Usage Monitor

**See how much of your Claude, ChatGPT, Gemini and Figma limits you have left — and exactly when they reset — for every account, in one window.**

[![Build](https://github.com/Jolly-Panda-Works/ai-usage-monitor/actions/workflows/build.yml/badge.svg)](https://github.com/Jolly-Panda-Works/ai-usage-monitor/actions/workflows/build.yml)
[![Latest release](https://img.shields.io/github/v/release/Jolly-Panda-Works/ai-usage-monitor?display_name=tag&color=F97316)](https://github.com/Jolly-Panda-Works/ai-usage-monitor/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/Jolly-Panda-Works/ai-usage-monitor/total?color=F97316)](https://github.com/Jolly-Panda-Works/ai-usage-monitor/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)](#download-and-install-windows)

[Download](https://github.com/Jolly-Panda-Works/ai-usage-monitor/releases/latest) · [Report a bug](https://github.com/Jolly-Panda-Works/ai-usage-monitor/issues/new?template=bug_report.yml) · [Request a feature](https://github.com/Jolly-Panda-Works/ai-usage-monitor/issues/new?template=feature_request.yml)

![AI Usage Monitor — usage overview](docs/screenshot-1-overview.png)

*Screenshots in this README use demo data.*

## Why?
If you use several AI accounts you constantly wonder: *which one still has quota, and when does the other one come back?* AI Usage Monitor answers that at a glance, with live countdowns and a Windows notification when an exhausted account becomes available again.

## Features
- Multiple accounts per service (e.g. several Claude accounts).
- **You sign in in your own browser** — Chrome, Edge or Brave, with your password manager, Google sign-in or passkeys. Nothing is ever opened or signed in inside the app.
- Used %, remaining % and a live **reset countdown** for every limit window (5-hour, weekly, …).
- Windows notification when a limit resets.
- **Automatic updates:** every build gets a higher version number, so each update installs over the previous one — in the app or by running the new installer.
- Dark-and-orange interface, **English and Persian (RTL)**.
- No telemetry; nothing leaves your PC. See [PRIVACY.md](PRIVACY.md).

## Screenshots
| | |
| --- | --- |
| ![Overview](docs/screenshot-1-overview.png) | ![Connect dialog](docs/screenshot-6-connect.png) |
| **Overview** — every account, every limit window | **Connect** — sign in with your own browser |
| ![Claude accounts](docs/screenshot-2-claude.png) | ![Manual counter](docs/screenshot-3-manual.png) |
| **Filter** by service (two Claude accounts) | **Manual counter** for Gemini / Figma |
| ![Persian RTL](docs/screenshot-4-persian.png) | ![Settings and About](docs/screenshot-5-settings.png) |
| **Persian (RTL)** interface | **Settings, About and updates** |

## How it works
```
 your browser (signed in)           your PC
┌────────────────────────┐        ┌──────────────────────┐
│ Connector extension    │  ───►  │ AI Usage Monitor app │
│ reads usage every min  │ 127.0.0.1 only, per-account token │
└────────────────────────┘        └──────────────────────┘
```
Claude and ChatGPT do not offer a public usage API for personal accounts, so a tiny **Connector extension** reads the usage page data *from the browser session you are already signed in with* and hands it to the desktop app over a local-only connection (`127.0.0.1`, protected by a random per-account token). Your password and cookies never reach the app.

## Connect an account
1. In the app press **Add account**, choose **Claude** or **ChatGPT**, name it, and press **Add account**. The *Connect* dialog opens.
2. **Open sign-in page in my browser** — sign in there the way you always do.
3. **Install the extension once** (Chrome / Edge / Brave): press **Open extension folder**, then open `chrome://extensions` → turn on *Developer mode* → **Load unpacked** → select that folder. (The same files are attached to every release as `AI-Usage-Monitor-Connector-<version>.zip`.)
4. Click the extension icon, paste the code from the app, press **Connect**. The card turns **Linked** within a minute.

**Several accounts of the same service?** Use one browser profile per account (each profile has its own sign-in), install the extension in each profile, and paste that account's own code. **Gemini and Figma** use a manual counter (no public usage API); the *Open site* button opens the site in your browser.

## Supported services
| Service | How usage is read | Notes |
| --- | --- | --- |
| **Claude** | Connector extension, from your browser session | 5-hour and weekly windows; multiple accounts via browser profiles |
| **ChatGPT** | Connector extension, from your browser session | Windows depend on your plan |
| **Gemini** | Manual counter | No public usage API for personal accounts |
| **Figma** | Manual counter | No public usage API for personal accounts |

> Claude and ChatGPT use **undocumented** website endpoints. They can change without notice; if one breaks, please [open an issue](https://github.com/Jolly-Panda-Works/ai-usage-monitor/issues/new?template=bug_report.yml). Results are percentages as reported by the service, not raw token counts. Chromium-based browsers only (Chrome, Edge, Brave, …).

## Download and install (Windows)
1. Open the [**Releases**](https://github.com/Jolly-Panda-Works/ai-usage-monitor/releases/latest) page.
2. Download `AI-Usage-Monitor-Setup-<version>.exe` (installer, **recommended**) or `AI-Usage-Monitor-Portable-<version>.exe` (no install, no auto-update).
3. Run it, then follow [Connect an account](#connect-an-account).

**Updating.** The installer version updates itself: the app checks GitHub Releases at start and every 6 hours, downloads new versions in the background and installs them when you quit (or press **Restart and update** in *Settings → About*). You can also simply run a newer installer — it installs over the old one and keeps your accounts and settings.

> **SmartScreen warning?** The app is not code-signed yet. Click **More info → Run anyway**. Verify downloads with `SHA256SUMS.txt` — see [CODE_SIGNING.md](CODE_SIGNING.md).

## Run from source
Requirements: **Node.js 20+**.
```
git clone https://github.com/Jolly-Panda-Works/ai-usage-monitor.git
cd ai-usage-monitor
npm install
npm start
```

## Build and release (GitHub Actions)
Every push to `main` builds the app on `windows-latest`, sets the version automatically and publishes a GitHub Release with the installer, the portable `.exe`, the update metadata (`latest.yml`), the extension zip and `SHA256SUMS.txt`. Documentation-only pushes (`*.md`, `docs/`) don't trigger a build. Releases do not use Actions artifact storage.

**Versioning.** `MAJOR.MINOR.<build number>` — `MAJOR.MINOR` come from `package.json` (change them there to start a new line, e.g. `1.3.0`); the build number is added by CI and only ever increases, which is what lets every update install over the previous one. The version shows in the app header and *Settings → About*. Pushing a tag `vX.Y.Z` publishes exactly that version (it must be higher than the latest one). Build locally with `npm install && npm run dist` → files appear in `dist/`.

## Project structure
```
ai-usage-monitor/
├── src/
│   ├── main.js          # Electron main process: windows, local bridge, updater
│   ├── bridge.js        # 127.0.0.1 receiver for the extension (token-protected)
│   ├── preload.js       # safe bridge to the UI
│   ├── providers.js     # service metadata + manual counters
│   ├── renderer.js      # UI logic + English/Persian strings
│   ├── index.html  styles.css
├── extension/           # Chromium Connector extension (usage fetchers live in fetchers.js)
├── assets/              # logo.svg / logo.png / icon.ico
├── docs/                # README screenshots (demo data)
├── tools/set-version.js # CI: decides the build version
├── .github/             # build/release + CI workflows, issue & PR templates, Dependabot
├── CHANGELOG.md  CONTRIBUTING.md  CODE_OF_CONDUCT.md
├── SECURITY.md  PRIVACY.md  CODE_SIGNING.md  LICENSE
└── package.json
```

## Limitations
- Unofficial endpoints (Claude, ChatGPT) may break when the websites change.
- Needs a Chromium-based browser for Claude / ChatGPT; the browser must be running for the extension to report.
- Gemini and Figma need manual counting.
- Windows only for packaged builds; no code signing yet.

## Troubleshooting
| Problem | Fix |
| --- | --- |
| Card says "Waiting for the browser extension…" | The browser is closed, the extension isn't installed/linked, or the code was pasted for another account. Open the extension popup — it shows the last status. |
| "Not signed in on the linked browser" | Sign in to the service in that browser (profile); it updates within a minute. |
| Extension says "Desktop app is not running" | Start AI Usage Monitor; keep only one copy running (it uses a local port 47821–47825). |
| ChatGPT shows "no usage data for this plan" | Your plan may not expose usage; open an issue with your plan type. |
| "Windows protected your PC" | **More info → Run anyway**; see [CODE_SIGNING.md](CODE_SIGNING.md). |

## Contributing
Contributions are welcome — read [CONTRIBUTING.md](CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md). Vulnerabilities: see [SECURITY.md](SECURITY.md).

## Responsible use
Use the app only with your own accounts and respect each service's terms of use. The app is not affiliated with Anthropic, OpenAI, Google or Figma. The authors are not responsible for misuse.

## License
Released under the [MIT License](LICENSE) © 2026 [Usef Farahmand](https://useffarahmand.com) · Jolly Panda Studio.

## Acknowledgments
[Electron](https://www.electronjs.org/) · [electron-builder](https://www.electron.build/) · [electron-updater](https://www.electron.build/auto-update)
