# Contributing

Thanks for helping! Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting started
```
git clone https://github.com/Jolly-Panda-Works/ai-usage-monitor.git
cd ai-usage-monitor
npm install
npm start
```
Requirements: Node.js 20+, Windows (the packaged app targets Windows; development works on any OS Electron supports).

## Project layout
- `extension/fetchers.js` — usage fetchers for Claude / ChatGPT. **Most contributions go here** (new service, fixed endpoint). Load the folder unpacked in Chrome to test.
- `src/providers.js` — service metadata and manual counters.
- `src/bridge.js` — token-protected `127.0.0.1` receiver for the extension; `src/main.js` — windows, accounts, updater, notifications.
- `src/renderer.js`, `index.html`, `styles.css` — UI and translations (`I18N` object).

## Adding a service
1. Add a fetcher to `extension/fetchers.js` returning `{ email, plan, note, windows:[{label, usedPct, resetsAt}] }` — and the host to `host_permissions` in `extension/manifest.json`.
2. Register it in `src/providers.js` (`kind: 'extension'`), add it to the `<select id="prov">` in `index.html`, to `NAMES` and the pairing check in `extension/popup.js`, and a badge color (`.p-<id>`) in the CSS.
3. Add any new `label` / `note` strings to **both** languages in `I18N`.

## Pull requests
- Keep PRs focused; describe what and why. Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:` …).
- Never commit cookies, tokens, e-mails or screenshots that show them.
- Update `CHANGELOG.md` for user-facing changes.
- CI runs a syntax check; please also run the app once with `npm start`.

## Releases & versions
Pushes to `main` build and publish a release automatically. The version is `MAJOR.MINOR.<build number>`; to start a new line, change `MAJOR.MINOR` in `package.json` (the patch part is overwritten by CI; the extension manifest follows). The number only ever increases so updates install over each other and the in-app updater can find them. Docs-only changes (`*.md`, `docs/`) don't trigger a build.
