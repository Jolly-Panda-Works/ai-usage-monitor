# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [Unreleased]
## [1.4.0]
### Added
- **Browser extension is back, and better** (`extension/`, v1.5.0): a dashboard popup of every Claude / ChatGPT account the browser is signed in with (usage bars, reset countdowns, rename/remove, English/Persian), toolbar badge, reset notifications — works **on its own**, and can optionally report to the desktop app.
- The extension introduces the desktop app: a **welcome page** on first install, an *About the desktop app* section and a download banner in the popup.
- Desktop app: connect with the **browser extension**, the **official app login**, a **browser cookie**, or a **Free quota tracker** (for accounts without usage meters) — four tabs in the Connect dialog; *Open extension folder* installs the extension files.
- Chrome Web Store kit: step-by-step guide (EN / FA), ready-to-paste listing and permission texts, 1280×800 screenshots, 440×280 and 1400×560 promo tiles (`store/`, `docs/`).
- Release now also contains `AI-Usage-Monitor-Extension-<version>.zip`.
### Changed
- Free-account hint: “No usage meters came back” now points to the free quota tracker.

## [1.3.0]
### Changed
- **No browser extension and no embedded sign-in.** Accounts connect through the official app login (Claude Code `.credentials.json` / Codex CLI `auth.json`, which sign in via your own browser) or a pasted browser cookie.
- Usage responses are now parsed generically, so “No usage data came back” is much less likely; every Claude organisation is tried.
### Added
- **Diagnostics** on each card (requests + response *structure*, no values) with a copy button.
- Clear error messages (expired login, missing file, Cloudflare, …); auto-refresh interval is back in Settings.
- In-app automatic updates (installer build) via GitHub Releases; version `MAJOR.MINOR.<build number>` is bumped automatically so updates install over each other.
- Automatic build and GitHub Release on every push to `main`; README screenshots; workflow to set the repository About and topics.
### Fixed
- Build no longer fails when GitHub's artifact storage quota is full (Release is the primary output).
- Percentages, counts and dates display in the correct order in the Persian (RTL) interface.

## [1.1.0] - 2026-10-21
### Added
- New dark-and-orange interface with sidebar, account filters, Settings and About dialog.
- App logo and Windows icon (`assets/`).
- English and Persian (RTL) interface, switchable in Settings.
- Open-source project files: LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, PRIVACY, CODE_SIGNING, issue and PR templates, CI workflow, Dependabot.
- `SHA256SUMS.txt` published with every release.

## [1.0.0] - 2026-10-20
### Added
- First release: usage, remaining quota and reset countdown for several Claude accounts and ChatGPT; manual quota counters for Gemini and Figma.
- Windows installer and portable build via GitHub Actions.
