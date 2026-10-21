# AI Usage Monitor Connector

Chromium (Chrome / Edge / Brave) extension for [AI Usage Monitor](../README.md).

It reads your **Claude** and **ChatGPT** usage from the browser session you are already signed in with and reports it, once a minute, **only** to the desktop app on your own PC (`http://127.0.0.1`, protected by a per-account token). It requests no cookies permission and sends nothing to the internet except the normal requests to claude.ai / chatgpt.com that your browser would make.

## Install
1. In the desktop app: **Add account → Open extension folder** (or unzip `AI-Usage-Monitor-Connector-<version>.zip` from the release).
2. `chrome://extensions` → **Developer mode** → **Load unpacked** → select the folder.
3. Click the extension icon, paste the code shown in the app, press **Connect**.

After updating the desktop app, press the reload icon on the extension card in `chrome://extensions`.

## Files
- `fetchers.js` — usage fetchers per service (edit here when an endpoint changes).
- `background.js` — once-a-minute sync and local delivery.
- `popup.*` — pairing UI.
