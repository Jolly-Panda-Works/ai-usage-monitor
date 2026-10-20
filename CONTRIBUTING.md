# Contributing

Thanks for helping! Please follow the [Code of Conduct](CODE_OF_CONDUCT.md).

## Getting started
```
git clone https://github.com/Jolly-Panda-Works/AIUsageMonitor.git
cd AIUsageMonitor
npm install
npm start
```
Requirements: Node.js 20+, Windows (the packaged app targets Windows; development works on any OS Electron supports).

## Project layout
- `src/providers.js` — one fetcher per service. **Most contributions go here** (new service, fixed endpoint).
- `src/main.js` — windows, per-account sessions, refresh timer, notifications.
- `src/renderer.js`, `index.html`, `styles.css` — UI and translations (`I18N` object).

## Adding a service
1. Add a provider in `src/providers.js` returning `{ email, plan, note, windows:[{label, usedPct, resetsAt}] }`.
2. Add it to the `<select id="prov">` in `index.html` and to `NAMES` + badge color (`.p-<id>`) in the renderer / CSS.
3. Add any new `label` / `note` strings to **both** languages in `I18N`.

## Pull requests
- Keep PRs focused; describe what and why. Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:` …).
- Never commit cookies, tokens, e-mails or screenshots that show them.
- Update `CHANGELOG.md` for user-facing changes.
- CI runs a syntax check; please also run the app once with `npm start`.
