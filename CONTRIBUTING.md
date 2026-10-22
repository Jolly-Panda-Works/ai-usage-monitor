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
- `extension/` — the browser extension (`fetchers.js` = usage fetchers used in the browser, `background.js`, `popup.*`, `welcome.*`). Load the folder unpacked in Chrome to test.
- `src/fetchers.js` — usage fetchers for Claude / ChatGPT (official-app login and cookie methods). **Most contributions go here** (new service, fixed endpoint). Responses are parsed generically (`scanWindows`) and a diagnostics log is kept.
- `src/providers.js` — service metadata, default login-file paths, manual counters.
- `src/main.js` — windows, accounts, refresh timer, updater, notifications; `src/bridge.js` — token-protected `127.0.0.1` receiver for the extension.
- `src/renderer.js`, `index.html`, `styles.css` — UI and translations (`I18N` object).

## Adding a service
1. Add its fetchers to `src/fetchers.js` (and `extension/fetchers.js` for the browser) returning `{ email, plan, note, windows:[{label, usedPct, resetsAt}] }` and wire them in `fetchUsage`.
2. Register it in `src/providers.js` (`kind: 'auto'`, cookie name/url, login-file path), add it to the `<select id="prov">` in `index.html`, to `NAMES` in the renderer and a badge color (`.p-<id>`) in the CSS.
3. Add any new `label` / `note` / error strings to **both** languages in `I18N`.

## Pull requests
- Keep PRs focused; describe what and why. Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:` …).
- Never commit cookies, tokens, e-mails or screenshots that show them.
- Update `CHANGELOG.md` for user-facing changes.
- CI runs a syntax check; please also run the app once with `npm start`.

## Releases & versions
Pushes to `main` build and publish a release automatically. The version is `MAJOR.MINOR.<build number>`; to start a new line, change `MAJOR.MINOR` in `package.json` (the patch part is overwritten by CI). The number only ever increases so updates install over each other and the in-app updater can find them. Docs-only changes (`*.md`, `docs/`) don't trigger a build.

## Extension releases
The extension has its own version in `extension/manifest.json`; raise it before every Chrome Web Store upload (the app's CI never changes it). Publishing steps: [docs/PUBLISH_EXTENSION.md](docs/PUBLISH_EXTENSION.md).
