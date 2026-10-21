# Privacy

AI Usage Monitor runs entirely on your computer.

- **No telemetry, no analytics, no server of ours.**
- **No passwords or cookies are stored or read by the app.** You sign in to Claude / ChatGPT in your own browser. The Connector extension calls the services' usage endpoints *inside your browser* (as the website itself does) and sends only the resulting numbers — percentage used, reset time, plan name, e-mail address shown for the account — to the desktop app.
- **Local-only delivery.** The app listens on `127.0.0.1` (ports 47821–47825) and accepts only requests that carry the random per-account token created in the app. It is not reachable from other computers.
- **Stored data** (`%APPDATA%\AI Usage Monitor`): `accounts.json` (account labels, per-account pairing tokens, last usage numbers, manual counters, language) and a copy of the extension files. Removing an account in the app deletes its token, so the extension's reports for it are rejected.
- **Updates:** the installer version contacts GitHub Releases to look for new versions. The portable build does not.

To erase everything, remove the accounts in the app, remove the extension from your browser and delete the data folder.
