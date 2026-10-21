importScripts('fetchers.js');

const PORTS = [47821, 47822, 47823, 47824, 47825];

const getLinks = async () => (await chrome.storage.local.get('links')).links || [];
const setLinks = links => chrome.storage.local.set({ links });

async function post(link, payload) {
  const ports = [link.port, ...PORTS.filter(p => p !== link.port)];
  for (const port of ports) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/v1/usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + link.token },
        body: JSON.stringify(payload)
      });
      if (r.status === 401) return { ok: false, error: 'Rejected by the app (account removed?)' };
      if (r.ok) { link.port = port; return { ok: true }; }
    } catch {}
  }
  return { ok: false, error: 'Desktop app is not running' };
}

let running = false;
async function syncAll() {
  if (running) return;
  running = true;
  try {
    const links = await getLinks();
    for (const link of links) {
      const fetcher = FETCHERS[link.provider];
      if (!fetcher) continue;
      let payload;
      try { payload = { provider: link.provider, ...(await fetcher()) }; }
      catch (e) { payload = { provider: link.provider, windows: [], error: String((e && e.message) || e).slice(0, 80) }; }
      const res = await post(link, payload);
      link.last = { at: Date.now(), ok: res.ok && !payload.error, msg: res.ok ? (payload.error === 'NOT_LOGGED_IN' ? 'Not signed in on this browser' : (payload.error || 'OK')) : res.error };
    }
    const fresh = await getLinks();
    for (const l of fresh) {
      const u = links.find(x => x.token === l.token);
      if (u) { l.last = u.last; l.port = u.port; }
    }
    await setLinks(fresh);
  } finally { running = false; }
}

function ensureAlarm() {
  chrome.alarms.get('sync', a => { if (!a) chrome.alarms.create('sync', { periodInMinutes: 1 }); });
}
chrome.runtime.onInstalled.addListener(ensureAlarm);
chrome.runtime.onStartup.addListener(() => { ensureAlarm(); syncAll(); });
chrome.alarms.onAlarm.addListener(a => { if (a.name === 'sync') syncAll(); });
chrome.runtime.onMessage.addListener((msg, _s, send) => {
  if (msg && msg.type === 'syncNow') { syncAll().then(() => send(true)); return true; }
});
ensureAlarm();
