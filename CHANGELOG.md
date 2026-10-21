# Changelog

All notable changes to this project are documented here.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [SemVer](https://semver.org/).

## [Unreleased]
## [1.2.0]
### Changed
- **Accounts are now signed in through your own browser** (Chrome / Edge / Brave) instead of an embedded window. Claude and ChatGPT usage is read by the new **Connector extension** and delivered to the app over a token-protected local connection (`127.0.0.1`).
- Removed the auto-refresh interval setting (the extension reports every minute).
### Added
- Connector extension (`extension/`), attached to every release as a zip.
- In-app automatic updates (installer build) via GitHub Releases; **Settings → About** shows update status. Every build gets a higher version, so updates install over the previous version.
- Automatic build and GitHub Release on every push to `main`; version is `MAJOR.MINOR.<build number>`.
- README screenshots (`docs/`), single-instance lock, workflow to set the repository About and topics.
### Fixed
- Build no longer fails when GitHub's artifact storage quota is full: the Release is the primary output; artifacts are uploaded only for dev builds (non-fatal).
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
