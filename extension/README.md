# AI Usage Monitor — browser extension

Chromium (Chrome / Edge / Brave) extension for [AI Usage Monitor](../README.md).

It reads your **Claude** and **ChatGPT** usage from the browser session you are already signed in with and

1. **shows it in its own popup** — accounts, plan, e-mail, usage bars and reset countdowns (English / Persian). Accounts you used before in this browser stay listed with their last numbers; you can rename or remove them;
2. puts the highest usage on the **toolbar badge** and sends a **notification** when a limit has reset;
3. optionally **reports to the desktop app** on your own PC (`http://127.0.0.1`, protected by a per-account token).

It requests no cookies permission and sends nothing to the internet except the normal requests to claude.ai / chatgpt.com that your browser would make. Everything it stores stays in `chrome.storage.local`.

## Install
1. Get the folder: in the desktop app **Connect → Browser extension → Open extension folder**, or unzip `AI-Usage-Monitor-Extension-<version>.zip` from the release. (Once published: install from the Chrome Web Store.)
2. `chrome://extensions` → **Developer mode** → **Load unpacked** → select the folder.
3. Sign in to claude.ai / chatgpt.com in that browser and click the extension icon.
4. *(optional)* To link the desktop app: press **Connect** on an account in the app, open the **Browser extension** tab, copy the code, open *Desktop app link* in the popup and paste it.

On first install a **welcome page** introduces the extension and the free [desktop app](https://github.com/Jolly-Panda-Works/ai-usage-monitor/releases/latest); the popup has an *About the desktop app* section too.

After updating the extension files (manual install), press the reload icon on its card in `chrome://extensions`. Publishing on the Chrome Web Store: see [../docs/PUBLISH_EXTENSION.md](../docs/PUBLISH_EXTENSION.md).

## Files
- `fetchers.js` — usage fetchers per service (edit here when an endpoint changes).
- `background.js` — service worker: periodic sync, stored accounts, badge, notifications, local delivery.
- `popup.*` — the dashboard UI (accounts, settings, desktop-app promo and link).
- `welcome.*` — first-run page introducing the extension and the desktop app.
