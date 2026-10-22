# Chrome Web Store — ready-to-paste listing

Everything below can be pasted into the Developer Dashboard (see [docs/PUBLISH_EXTENSION.md](../docs/PUBLISH_EXTENSION.md)).
Dashboard wording changes from time to time — follow the labels on screen and use these texts as the content.

## Package
Upload `AI-Usage-Monitor-Extension-<version>.zip` (attached to every release of this repo). `manifest.json` must be at the **root** of the zip. Raise `version` in `extension/manifest.json` for every new upload.

## Store listing tab
| Field | Value |
| --- | --- |
| Name | AI Usage Monitor |
| Summary (≤ 132 chars) | Claude and ChatGPT usage and reset times in your browser, optionally synced to the AI Usage Monitor desktop app on your PC. |
| Category | Productivity |
| Language | English (add Persian as a second locale if you like) |
| Official / homepage URL | https://github.com/Jolly-Panda-Works/ai-usage-monitor |
| Support URL | https://github.com/Jolly-Panda-Works/ai-usage-monitor/issues |
| Store icon (128×128) | `extension/icons/icon128.png` (also inside the zip) |
| Screenshots (1280×800, up to 5) | `store/screenshot-1-popup.png`, `screenshot-2-persian.png`, `screenshot-3-welcome.png`, `screenshot-4-desktop.png` (+ optional `screenshot-5-welcome-fa.png` for a Persian locale) |
| Small promo tile (440×280, **required**) | `store/promo-small-440x280.png` |
| Marquee promo tile (1400×560, optional) | `store/promo-marquee-1400x560.png` |

### Detailed description
```
See how much of Claude and ChatGPT you have left — and exactly when it resets — right in your browser.

AI Usage Monitor reads your usage from the Claude (claude.ai) and ChatGPT (chatgpt.com) accounts you are already signed in with and shows it in a small dashboard:

• Every account you use in this browser: plan, e-mail, usage bars (used / left)
• A live countdown to every reset (5-hour, weekly, …)
• The highest usage on the toolbar badge (green / amber / red)
• An optional notification when a limit has reset and the account is usable again
• Rename or remove accounts, choose the refresh interval, English and Persian (RTL) interface

Optional desktop app
AI Usage Monitor for Windows is a free, open-source companion that puts all your AI accounts — Claude, ChatGPT, Gemini, Figma, several accounts of each — in one window, with a free quota tracker for accounts that have no usage meters. Link this browser to it with a one-time code. The link is local only (127.0.0.1) and optional; the extension works fine on its own.

Privacy
• No account on our side, no analytics, no ads. Nothing is sent to us.
• The extension only talks to claude.ai and chatgpt.com (the same requests your browser already makes while you use them) and, if you choose, to the desktop app on your own PC.
• Everything it stores stays in chrome.storage.local on your device.
• Open source (MIT): https://github.com/Jolly-Panda-Works/ai-usage-monitor

Claude and ChatGPT do not offer a public usage API for personal accounts, so the extension uses the same website endpoints their own pages use; these may change without notice. Not affiliated with Anthropic, OpenAI, Google or Figma.
```

## Privacy tab
**Single purpose description**
```
Show the usage and reset times of the user's Claude and ChatGPT accounts in the browser (with an optional link to the user's own desktop app).
```

**Permission justifications**
| Permission | Justification |
| --- | --- |
| `storage` | Keeps the list of accounts seen in this browser, their last usage numbers, the user's settings and the optional desktop-app link in chrome.storage.local. |
| `alarms` | Refreshes the usage periodically (every minute by default, configurable) while the browser is open. |
| `notifications` | Optionally tells the user when a usage limit has reset. Can be switched off in the popup settings. |
| Host `https://claude.ai/*` | Reads the signed-in user's plan and usage from the Claude website's own endpoints, using the session the browser already has. |
| Host `https://chatgpt.com/*` | Reads the signed-in user's plan and usage from the ChatGPT website's own endpoints, using the session the browser already has. |
| Host `http://127.0.0.1/*` | Optional delivery of the numbers to the user's own AI Usage Monitor desktop app on the same computer (loopback only). |

**Remote code:** *No, I am not using remote code.* (All JavaScript is inside the package; no `eval`, no externally hosted scripts.)

**Data usage (what to tick)** — the extension handles the account e-mail address (shown in the popup, stored locally, optionally forwarded to the user's own desktop app) and the usage numbers read from the services. Disclose conservatively:
- *Personally identifiable information* — account e-mail address (processed on-device)
- *Website content* — usage / plan data read from claude.ai and chatgpt.com (processed on-device)

Then certify all three statements: not sold to third parties; not used or transferred for purposes unrelated to the item's single purpose; not used for creditworthiness or lending.

**Privacy policy URL:** https://github.com/Jolly-Panda-Works/ai-usage-monitor/blob/main/PRIVACY.md

## Distribution tab
- Visibility: **Public** (or **Unlisted** for a first test round — anyone with the link can install)
- Regions: all regions
- Price: free
