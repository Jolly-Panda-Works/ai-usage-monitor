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
- `src/providers.js` — usage fetchers for Claude / ChatGPT (**most contributions go here**: new service, fixed endpoint), service metadata and the Free-quota tracker logic.
- `src/main.js` — windows, per-account sessions and sign-in window, accounts, updater, notifications.
- `src/renderer.js`, `index.html`, `styles.css` — UI and translations (`I18N` object).

## Adding a service
1. In `src/providers.js` add a provider: `kind: 'session'` with `loginUrl`, `origin`, `cookie` (name of the session cookie) and an async `fetch(ses)` that returns `{ email, plan, note, windows:[{label, usedPct, resetsAt}] }` (use the `J(ses, url)` helper — it sends the account's own session cookies). Services without a usage API use `kind: 'manual'` (tracker only).
2. Add it to the `<select id="prov">` in `index.html`, to `NAMES` in `renderer.js`, and a badge color (`.p-<id>`) in the CSS.
3. Add any new `label` / `note` / error strings to **both** languages in `I18N`.

## Pull requests
- Keep PRs focused; describe what and why. Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:` …).
- Never commit cookies, tokens, e-mails or screenshots that show them.
- Update `CHANGELOG.md` for user-facing changes.
- CI runs a syntax check; please also run the app once with `npm start`.

## Releases & versions
Pushes to `main` build and publish a release automatically. The version is `MAJOR.MINOR.<build number>`; to start a new line, change `MAJOR.MINOR` in `package.json` (the patch part is overwritten by CI). The number only ever increases so updates install over each other and the in-app updater can find them. Docs-only changes (`*.md`, `docs/`) don't trigger a build.
