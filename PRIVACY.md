# Privacy

AI Usage Monitor runs entirely on your computer.

- **No telemetry, no analytics, no server of ours.** The app talks only to the services you connect (claude.ai, chatgpt.com, …).
- **No passwords are stored.** You sign in inside an isolated browser window; only that window's session cookies are kept, per account, in the app's data folder (`%APPDATA%\AI Usage Monitor`). Removing an account clears its session.
- **Account list and settings** are saved as `accounts.json` in the same folder (labels, last usage numbers, manual counters).
- Usage numbers are requested from each service with your own session, the same way their website does.

To erase everything, remove the accounts in the app and delete the data folder.
