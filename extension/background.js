// Service worker. Every few minutes it reads Claude / ChatGPT usage with the session this browser is
// already signed in with and
//   1. keeps it in chrome.storage.local, so the popup works on its own (accounts, usage, reset times),
//   2. shows the highest usage on the toolbar badge and notifies when a limit has reset,
//   3. optionally forwards it to the AI Usage Monitor desktop app on 127.0.0.1 (pairing code).
importScripts('fetchers.js');

const PORTS = [47821, 47822, 47823, 47824, 47825];
const NAMES = { claude: 'Claude', chatgpt: 'ChatGPT' };
const DEFAULTS = { intervalMin: 1, notify: true, lang: null };

// All reads/writes of the stored state run one after another, so the popup and the timer never race.
let queue = Promise.resolve();
const run = fn => { const p = queue.then(fn); queue = p.catch(() => {}); return p; };

const load = async () => {
  const st = await chrome.storage.local.get(['accounts', 'links', 'status', 'settings']);
  return { accounts: st.accounts || [], links: st.links || [], status: st.status || {}, settings: { ...DEFAULTS, ...(st.settings || {}) } };
};
const save = s => chrome.storage.local.set({ accounts: s.accounts, links: s.links, status: s.status, settings: s.settings });

const exhausted = a => !!(a.windows && a.windows.some(w => w.usedPct >= 100));

async function post(link, payload) {
  const ports = [link.port, ...PORTS.filter(p => p !== link.port)];
  for (const port of ports) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/v1/usage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + link.token },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(4000)
      });
      if (r.status === 401) return { ok: false, error: 'Rejected by the app (account removed?)' };
      if (r.ok) { link.port = port; return { ok: true }; }
    } catch {}
  }
  return { ok: false, error: 'Desktop app is not running' };
}

async function probe(provider) {
  try { return { ...(await FETCHERS[provider]()), error: null }; }
  catch (e) { return { email: null, plan: null, windows: [], note: null, error: String((e && e.message) || e).slice(0, 80) }; }
}

function notify(settings, acc) {
  if (!settings.notify || !chrome.notifications) return;
  const fa = settings.lang === 'fa';
  const name = acc.label || acc.email || NAMES[acc.provider];
  chrome.notifications.create('reset-' + acc.id + '-' + Date.now(), {
    type: 'basic', iconUrl: 'icons/icon128.png', title: 'AI Usage Monitor',
    message: fa ? `${name} دوباره قابل استفاده است ✅` : `${name} is available again ✅`
  });
}

function updateBadge(accounts) {
  const act = accounts.filter(a => a.active && a.windows && a.windows.length);
  if (!act.length) {
    chrome.action.setBadgeText({ text: '' });
    chrome.action.setTitle({ title: 'AI Usage Monitor' });
    return;
  }
  const max = Math.max(...act.flatMap(a => a.windows.map(w => w.usedPct)));
  chrome.action.setBadgeText({ text: String(Math.round(max)) });
  chrome.action.setBadgeBackgroundColor({ color: max < 70 ? '#2fbf71' : max < 90 ? '#f0a73a' : '#ee5555' });
  const lines = act.map(a => `${a.label || a.email || NAMES[a.provider]}: ` + a.windows.map(w => `${w.label} ${Math.round(w.usedPct)}%`).join(', '));
  chrome.action.setTitle({ title: 'AI Usage Monitor\n' + lines.join('\n') });
}

// Folds one probe result into the stored account list.
function apply(s, provider, r, notes, now) {
  const { accounts, status } = s;
  if (r.error === 'NOT_LOGGED_IN') {
    accounts.forEach(a => { if (a.provider === provider) a.active = false; });
    status[provider] = { state: 'signed_out', at: now };
    return;
  }
  if (r.error) {                                   // network / HTTP problem: keep the last numbers
    const act = accounts.find(a => a.provider === provider && a.active);
    if (act) act.error = r.error;
    status[provider] = { state: 'error', msg: r.error, at: now };
    return;
  }
  const id = provider + ':' + (r.email ? r.email.toLowerCase() : 'session');
  let acc = accounts.find(a => a.id === id);
  if (!acc) {
    const anon = accounts.find(a => a.id === provider + ':session');
    if (anon && r.email) { acc = anon; acc.id = id; }              // the e-mail became known
    else { acc = { id, provider, label: '', firstSeen: now }; accounts.push(acc); }
  }
  accounts.forEach(a => { if (a.provider === provider) a.active = a === acc; });
  Object.assign(acc, { email: r.email || null, plan: r.plan || null, windows: r.windows, note: r.note || null, error: null, updatedAt: now });
  const ex = exhausted(acc);
  if (acc.wasExhausted && !ex) notes.push(acc);
  acc.wasExhausted = ex;
  status[provider] = { state: 'ok', at: now };
}

async function syncAll() {
  const s = await load();
  const notes = [], now = Date.now();
  for (const provider of Object.keys(FETCHERS)) {
    const r = await probe(provider);
    apply(s, provider, r, notes, now);
    // optional delivery to the desktop app (one pairing code per account in the app)
    for (const link of s.links.filter(l => l.provider === provider)) {
      const res = await post(link, { provider, email: r.email, plan: r.plan, note: r.note, error: r.error, windows: r.windows || [] });
      link.last = { at: Date.now(), ok: res.ok && !r.error, msg: res.ok ? (r.error === 'NOT_LOGGED_IN' ? 'Not signed in on this browser' : (r.error || 'OK')) : res.error };
    }
  }
  await save(s);
  updateBadge(s.accounts);
  notes.forEach(a => notify(s.settings, a));
}

function ensureAlarm(min) {
  chrome.alarms.get('sync', a => {
    if (!a || a.periodInMinutes !== min) chrome.alarms.create('sync', { periodInMinutes: min });
  });
}
async function boot(syncNow) {
  const s = await load();
  ensureAlarm(s.settings.intervalMin);
  updateBadge(s.accounts);
  if (syncNow) run(syncAll);
}

// Popup -> background (all edits go through the same queue).
const ACTIONS = {
  syncNow: () => syncAll(),
  async rename({ id, label }) {
    const s = await load(); const a = s.accounts.find(x => x.id === id);
    if (a) { a.label = String(label || '').slice(0, 60); await save(s); updateBadge(s.accounts); }
  },
  async remove({ id }) {
    const s = await load(); s.accounts = s.accounts.filter(x => x.id !== id); await save(s); updateBadge(s.accounts);
  },
  async setSettings({ patch }) {
    const s = await load();
    if (patch.lang === 'en' || patch.lang === 'fa') s.settings.lang = patch.lang;
    if (typeof patch.notify === 'boolean') s.settings.notify = patch.notify;
    if (patch.intervalMin != null) s.settings.intervalMin = Math.min(120, Math.max(1, Number(patch.intervalMin) || 1));
    await save(s); ensureAlarm(s.settings.intervalMin);
  },
  async addLink({ link }) {
    const s = await load();
    s.links = [...s.links.filter(k => k.token !== link.token), link]; await save(s);
    return syncAll();
  },
  async removeLink({ token }) {
    const s = await load(); s.links = s.links.filter(k => k.token !== token); await save(s);
  }
};

chrome.runtime.onInstalled.addListener(() => boot(true));
chrome.runtime.onStartup.addListener(() => boot(true));
chrome.alarms.onAlarm.addListener(a => { if (a.name === 'sync') run(syncAll); });
chrome.runtime.onMessage.addListener((msg, sender, send) => {
  if (sender.id !== chrome.runtime.id || !msg || !ACTIONS[msg.type]) return;
  run(() => ACTIONS[msg.type](msg)).then(() => send(true), () => send(false));
  return true;
});
boot(false);
