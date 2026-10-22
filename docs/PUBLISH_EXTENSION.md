# Publishing the extension on the Chrome Web Store — step by step

Works for Chrome, and also for Edge, Brave and other Chromium browsers (they install from the same store). Persian version: [PUBLISH_EXTENSION.fa.md](PUBLISH_EXTENSION.fa.md). All texts you need are in [store/LISTING.md](../store/LISTING.md).

## 0. Checklist (already prepared in this repo)
- [x] Manifest V3, icons 16/32/48/128, description ≤ 132 characters
- [x] Screenshots 1280×800, small promo tile 440×280, marquee 1400×560 → `store/`
- [x] Privacy policy → `PRIVACY.md` (public URL below)
- [x] Single purpose + permission justifications + listing texts → `store/LISTING.md`
- [ ] A Google account for the developer registration and **US $5** (one-time fee)

## 1. Test the package locally
1. Open `chrome://extensions`, switch **Developer mode** on, press **Load unpacked** and choose the `extension/` folder.
2. Sign in to claude.ai / chatgpt.com in that browser, click the extension icon: your accounts and usage bars must appear. Check the toolbar badge, *Settings* (language, interval, notifications) and *About the AI Usage Monitor desktop app*.
3. Optional: link the desktop app (app → *Connect* → *Browser extension* → copy code → paste in the popup → card shows **Linked**).
4. On a fresh install the **welcome page** opens by itself (remove and re-add the extension to see it again).

## 2. Build the zip
Use the `AI-Usage-Monitor-Extension-<version>.zip` attached to the GitHub release, **or** zip the *contents* of `extension/` yourself.
`manifest.json` must be at the **root** of the zip (not inside a sub-folder).
For every later upload, **raise `version`** in `extension/manifest.json` (e.g. `1.5.0` → `1.5.1`) — the store rejects an equal or lower version.

## 3. Create the developer account (once)
1. Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) and sign in with a Google account (a dedicated account for publishing is recommended — notifications and ownership are tied to it).
2. Accept the developer agreement and pay the one-time **$5** registration fee.
3. In *Account*, set and verify the contact e-mail. Turn on **2-Step Verification** for the Google account if the dashboard asks for it. If it asks whether you are a *trader* (EU rules), answer according to your situation — a free open-source hobby project is normally a non-trader.

Note: a brand-new publisher can have at most two published extensions at first.

## 4. Upload
1. Dashboard → **Add new item** → choose the zip → **Upload**.
2. The item page opens with tabs on the left: *Package*, *Store listing*, *Privacy*, *Distribution*.

## 5. Store listing tab
Fill it from `store/LISTING.md`:
- Description (summary + detailed description), category **Productivity**, language
- Store icon 128×128, **at least one** screenshot 1280×800 (up to 5), **small promo tile 440×280 (required)**, marquee 1400×560 (optional)
- Official URL / homepage and support URL → the GitHub repo and its *Issues* page

## 6. Privacy tab
- **Single purpose** — paste from `store/LISTING.md`.
- **Permission justifications** — one box per permission (`storage`, `alarms`, `notifications`, and the three host permissions). Paste the matching texts. Reviewers read these: be specific.
- **Remote code** — *No, I am not using remote code.*
- **Data usage** — tick what the extension handles (e-mail address, usage data read from the websites) and certify the three statements.
- **Privacy policy URL** — `https://github.com/Jolly-Panda-Works/ai-usage-monitor/blob/main/PRIVACY.md`

## 7. Distribution tab
Visibility **Public** (or **Unlisted** for a first round — only people with the link can install), all regions, free.

## 8. Submit for review
1. Press **Submit for review**. In the dialog you can untick "publish automatically after review" if you want to publish by hand later (*Defer publish*).
2. Wait for the review e-mail. It often takes a few days; extensions with host permissions can take longer. You can follow the status on the item page.
3. If it is **rejected**: read the e-mail, fix exactly what it names (typical causes: permission justification too vague, listing text that does not match the behaviour, missing privacy policy), bump the version and submit again.

## 9. After it is live
1. Copy the store URL (`https://chromewebstore.google.com/detail/…/<extension id>`).
2. Put it into the desktop app: in `src/main.js` set `EXTENSION_STORE_URL` — the *Connect → Browser extension* tab then shows a **Get it on Chrome Web Store** button. Also add the link to the README and the welcome page if you want.
3. Push to `main` — the build workflow releases a new app version automatically.

## 10. Updating later
Change the code → raise `version` in `extension/manifest.json` → download the new zip from the release (or re-zip) → dashboard → your item → **Package** → **Upload new package** → **Submit for review**. Users get the update automatically after approval.

## Optional: Microsoft Edge Add-ons
The same zip can also be submitted (free) at the [Edge Add-ons partner center](https://partner.microsoft.com/dashboard/microsoftedge/overview) so Edge users find it in their own store.
