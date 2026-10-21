# Privacy

AI Usage Monitor runs entirely on your computer.

- **No telemetry, no analytics, no server of ours.**
- **No passwords are seen or stored.** You sign in to Claude / ChatGPT inside the app's sign-in window, exactly like in a browser. Like a browser profile, the app keeps the session cookies those sites set — one separate, isolated session per account — in its data folder (`%APPDATA%\AI Usage Monitor`). If you use the optional *cookie* sign-in, the cookie you paste is stored the same way, in that account's own session only.
- **Who the app talks to:** only the services you added (`claude.ai`, `chatgpt.com`), to read the usage the website itself shows you, and GitHub Releases to check for updates (installer build only). Usage numbers are never sent anywhere else.
- **Stored data** (`%APPDATA%\AI Usage Monitor`): `accounts.json` (account labels, last usage numbers, Free-quota tracker values, language, refresh interval) and the per-account sessions. Removing an account in the app deletes its session.
- **Updates:** the installer version contacts GitHub Releases to look for new versions. The portable build does not.

To erase everything, remove the accounts in the app and delete the data folder.
