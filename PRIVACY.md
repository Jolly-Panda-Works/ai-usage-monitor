# Privacy

AI Usage Monitor runs entirely on your computer.

- **No telemetry, no analytics, no server of ours.**
- **No passwords are seen or stored.** You sign in to Claude / ChatGPT inside the app's sign-in window, exactly like in a browser. Like a browser profile, the app keeps the session cookies those sites set — one separate, isolated session per account — in its data folder (`%APPDATA%\AI Usage Monitor`). If you use the optional *cookie* sign-in, the cookie you paste is stored the same way, in that account's own session only.
- **Who the app talks to:** only the services you added (`claude.ai`, `chatgpt.com`), to read the usage the website itself shows you, and GitHub Releases to check for updates (installer build only). Usage numbers are never sent anywhere else.
- **Stored data** (`%APPDATA%\AI Usage Monitor`): `accounts.json` (account labels, last usage numbers, Free-quota tracker values, language, refresh interval) and the per-account sessions. Removing an account in the app deletes its session.
- **Optional browser extension:** it calls the services' usage endpoints *inside your browser* (as the website itself does) and keeps the resulting numbers — percentage used, reset time, plan name, e-mail address shown for the account — in the browser's extension storage. If you pair it with the app, it sends only those numbers to `127.0.0.1` (ports 47821–47825); the app accepts only requests that carry the random per-account token and is not reachable from other computers. The extension has no cookies permission and no server of its own; remove it in `chrome://extensions` to erase its data.
- **Updates:** the installer version contacts GitHub Releases to look for new versions. The portable build does not.

To erase everything, remove the accounts in the app and delete the data folder.
