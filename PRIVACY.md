# Privacy

AI Usage Monitor (desktop app and browser extension) runs entirely on your computer. **Nothing is collected by or sent to the developer.**

## Browser extension
- Reads your plan, account e-mail address and usage numbers from **claude.ai** and **chatgpt.com** using the session your browser already has (the same requests those websites make). It does not read, copy or store your password, cookies or tokens.
- Stores the account list, last usage numbers, your settings (language, interval, notifications) and — if you set it up — the desktop-app pairing code in `chrome.storage.local` on your device. Removing the extension deletes it.
- **Optional desktop link:** if you paste a pairing code, the numbers above are sent to the desktop app on the **same computer** (`http://127.0.0.1`, ports 47821–47825) with a per-account token. Nothing is sent to any other address.
- No analytics, advertising, tracking or remote code.

## Desktop app
- Talks only to the services you connect (api.anthropic.com, claude.ai, chatgpt.com) and, in the installer version, to GitHub Releases to look for updates.
- **No passwords are ever entered into the app.** You sign in with your own browser (extension / cookie) or the official command-line app.
- **Browser extension link:** the app listens on `127.0.0.1` only and accepts requests that carry the random per-account token created in the app.
- **Official app login:** the app stores only the *path* of the login file (`.credentials.json` / `auth.json`) and reads the access token from it when it refreshes; it never modifies the file.
- **Browser cookie:** the cookie you paste is kept only in that account's private browser storage on your PC (`%APPDATA%\AI Usage Monitor`). Removing the account deletes it.
- **Stored data** (`%APPDATA%\AI Usage Monitor\accounts.json`): account labels, login-file paths, extension pairing tokens, last usage numbers, a structure-only diagnostics log (keys/types, no values), counters and language.

To erase everything: remove the accounts in the app, remove the extension from your browser and delete the data folder.

Questions: open an issue at https://github.com/Jolly-Panda-Works/ai-usage-monitor/issues
