const { app, BrowserWindow, ipcMain, session, Notification, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const providers = require('./providers');

let autoUpdater = null;
try { autoUpdater = require('electron-updater').autoUpdater; } catch {}

const ICON = path.join(__dirname, '..', 'assets', 'logo.png');
let win;
let store = { accounts: [], settings: { lang: 'en', intervalMin: 5 } };
const file = () => path.join(app.getPath('userData'), 'accounts.json');

const isProvider = k => !!(providers[k] && providers[k].name);
const isSession = a => providers[a.provider].kind === 'session';

// ---------------------------------------------------------------- storage
function load() {
  try {
    const d = JSON.parse(fs.readFileSync(file(), 'utf8'));
    store.accounts = (d.accounts || []).filter(a => isProvider(a.provider));
    store.settings = { ...store.settings, ...(d.settings || {}) };
  } catch {
    store.settings.lang = app.getLocale().toLowerCase().startsWith('fa') ? 'fa' : 'en';
  }
  for (const a of store.accounts) {
    delete a.token; delete a.lastSeen;                       // leftovers of the browser-extension build (1.2.x)
    if (isSession(a)) a.partition = a.partition || 'persist:acct-' + a.id;
    else { delete a.partition; a.data = null; }
    if (a.manual) {                                          // old manual counter -> tracker
      const m = a.manual, base = providers.newTracker(a.provider);
      a.tracker = { ...base, label: m.label || base.label, limit: m.limit, used: m.used, periodHours: m.periodHours, resetsAt: m.resetsAt };
      delete a.manual;
    }
    if (!isSession(a) && !a.tracker) a.tracker = providers.newTracker(a.provider);
  }
  store.settings.intervalMin = Math.min(120, Math.max(1, Number(store.settings.intervalMin) || 5));
}
function save() { try { fs.writeFileSync(file(), JSON.stringify(store, null, 2)); } catch {} }

function publicState() {
  return {
    settings: store.settings,
    accounts: store.accounts.map(({ partition, ...a }) => ({
      ...a, kind: providers[a.provider].kind, tw: providers.trackerWindow(a.tracker)
    }))
  };
}
function push() { if (win && !win.isDestroyed()) win.webContents.send('state', publicState()); }

// ---------------------------------------------------------------- notifications
function exhausted(acc) {
  const d = acc.data;
  if (d && d.windows && d.windows.some(w => w.usedPct >= 100)) return true;
  const tw = providers.trackerWindow(acc.tracker);
  return !!(tw && tw.limit && tw.used >= tw.limit);
}
function finish(acc) {
  const now = exhausted(acc);
  if (acc.wasExhausted && !now && Notification.isSupported()) {
    const fa = store.settings.lang === 'fa';
    new Notification({
      title: 'AI Usage Monitor',
      body: fa ? `${acc.label} دوباره قابل استفاده است ✅` : `${acc.label} is available again ✅`,
      icon: ICON
    }).show();
  }
  acc.wasExhausted = now;
  save(); push();
}

// ---------------------------------------------------------------- sessions (sign-in lives inside the app)
function cleanUA() {
  return app.userAgentFallback.replace(/ Electron\/\S+/, '').replace(/ ai-usage-monitor\/\S+/i, '').replace(/ AI-Usage-Monitor\/\S+/i, '');
}
function sesFor(acc) {
  const ses = session.fromPartition(acc.partition);
  ses.setUserAgent(cleanUA());
  ses.setPermissionRequestHandler((_wc, _perm, cb) => cb(false));
  return ses;
}

async function refresh(acc) {
  if (!isSession(acc)) return finish(acc);
  const prev = acc.data;
  try {
    acc.data = { ...(await providers[acc.provider].fetch(sesFor(acc))), error: null };
  } catch (e) {
    acc.data = { ...(prev || {}), error: String((e && e.message) || e).slice(0, 80) };
  }
  acc.data.updatedAt = Date.now();
  finish(acc);
}
const refreshAll = () => Promise.all(store.accounts.map(refresh));

let timer;
function schedule() {
  clearInterval(timer);
  timer = setInterval(refreshAll, store.settings.intervalMin * 60 * 1000);
}

const loginWins = new Map();
function openLogin(acc) {
  const open = loginWins.get(acc.id);
  if (open && !open.isDestroyed()) { open.focus(); return; }
  const w = new BrowserWindow({
    width: 1000, height: 780, title: acc.label, icon: ICON, autoHideMenuBar: true,
    webPreferences: { partition: acc.partition, contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  loginWins.set(acc.id, w);
  w.webContents.setUserAgent(cleanUA());
  // Pop-ups (e.g. "Continue with Google") stay inside the same session; anything that is not https is blocked.
  w.webContents.setWindowOpenHandler(({ url }) => (/^https:/.test(url) ? { action: 'allow' } : { action: 'deny' }));
  w.loadURL(providers[acc.provider].loginUrl).catch(() => {});   // offline: the window simply stays blank
  w.on('closed', () => { loginWins.delete(acc.id); if (find(acc.id)) refresh(acc); });
}

// ---------------------------------------------------------------- auto-update (installer builds only)
let upd = { status: 'idle' };
function setUpd(s) { upd = s; if (win && !win.isDestroyed()) win.webContents.send('update', upd); }
const canUpdate = () => autoUpdater && app.isPackaged && !process.env.PORTABLE_EXECUTABLE_FILE;
function checkUpdates() { if (canUpdate()) autoUpdater.checkForUpdates().catch(() => setUpd({ status: 'error' })); }
function initUpdater() {
  if (!autoUpdater || !app.isPackaged) return setUpd({ status: 'dev' });
  if (process.env.PORTABLE_EXECUTABLE_FILE) return setUpd({ status: 'portable' });
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.logger = null;
  autoUpdater.on('checking-for-update', () => setUpd({ status: 'checking' }));
  autoUpdater.on('update-available', i => setUpd({ status: 'downloading', version: i.version }));
  autoUpdater.on('update-not-available', () => setUpd({ status: 'latest' }));
  autoUpdater.on('download-progress', p => setUpd({ status: 'downloading', version: upd.version, percent: Math.round(p.percent) }));
  autoUpdater.on('update-downloaded', i => {
    setUpd({ status: 'ready', version: i.version });
    if (Notification.isSupported()) {
      const fa = store.settings.lang === 'fa';
      new Notification({ title: 'AI Usage Monitor', body: fa ? `نسخه ${i.version} آماده نصب است؛ با بستن برنامه نصب می‌شود.` : `Version ${i.version} is ready — it installs when you quit the app.`, icon: ICON }).show();
    }
  });
  autoUpdater.on('error', () => setUpd({ status: 'error' }));
  checkUpdates();
  setInterval(checkUpdates, 6 * 3600e3);
}

function createWindow() {
  win = new BrowserWindow({
    width: 1100, height: 760, minWidth: 780, minHeight: 540,
    title: 'AI Usage Monitor', icon: ICON, backgroundColor: '#140f0c', autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: 'deny' }; });
  win.webContents.on('will-navigate', e => e.preventDefault());
  win.loadFile(path.join(__dirname, 'index.html'));
}

// ---------------------------------------------------------------- IPC
const find = id => store.accounts.find(a => a.id === id);
const withTracker = (id, fn) => { const a = find(id); if (!a || !a.tracker || !a.tracker.enabled) return; fn(a.tracker, Date.now()); finish(a); };

ipcMain.handle('state:get', () => publicState());
ipcMain.handle('app:info', () => ({ version: app.getVersion() }));

ipcMain.handle('account:add', (_e, { provider, label }) => {
  if (!isProvider(provider)) return null;
  const p = providers[provider];
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const acc = { id, provider, label: String(label || p.name).slice(0, 60), data: null };
  if (p.kind === 'session') acc.partition = 'persist:acct-' + id;
  else acc.tracker = providers.newTracker(provider);
  store.accounts.push(acc);
  save(); push();
  if (p.kind === 'session') openLogin(acc);
  return { id, kind: p.kind };
});

ipcMain.handle('account:remove', async (_e, id) => {
  const acc = find(id); if (!acc) return;
  const w = loginWins.get(id); if (w && !w.isDestroyed()) w.destroy();
  if (acc.partition) { try { await session.fromPartition(acc.partition).clearStorageData(); } catch {} }
  store.accounts = store.accounts.filter(a => a.id !== id);
  save(); push();
});

// Claude / ChatGPT: sign-in window inside the app. Gemini / Figma: just open the site in the normal browser.
ipcMain.handle('account:signin', (_e, id) => {
  const a = find(id); if (!a) return;
  if (isSession(a)) openLogin(a); else shell.openExternal(providers[a.provider].loginUrl);
});
ipcMain.handle('account:browser', (_e, id) => { const a = find(id); if (a) shell.openExternal(providers[a.provider].loginUrl); });
ipcMain.handle('account:refresh', (_e, id) => { const a = find(id); if (a) return refresh(a); });
ipcMain.handle('refresh:all', () => refreshAll());

// Alternative to the sign-in window (e.g. Google sign-in is blocked in embedded windows):
// the user pastes the site's session cookie, which is stored only in this account's own session.
ipcMain.handle('account:cookies', async (_e, { id, input }) => {
  const a = find(id);
  if (!a || !isSession(a)) return { error: 'FAILED' };
  const p = providers[a.provider];
  let list;
  try { list = providers.parseCookies(a.provider, input); }
  catch (e) { return { error: e.message === 'EMPTY' ? 'EMPTY' : 'BAD_COOKIE' }; }
  try {
    const ses = sesFor(a);
    const exp = Math.floor(Date.now() / 1000) + 30 * 86400;
    for (const [name, value] of list) await ses.cookies.set({ url: p.origin, name, value, secure: true, httpOnly: true, expirationDate: exp });
  } catch { return { error: 'FAILED' }; }
  await refresh(a);
  return { ok: true, status: (a.data && a.data.error) || null };
});

// Free-plan quota tracker
ipcMain.handle('tracker:enable', (_e, id) => {
  const a = find(id); if (!a) return;
  a.tracker = providers.newTracker(a.provider);
  finish(a);
});
ipcMain.handle('tracker:disable', (_e, id) => {
  const a = find(id); if (!a || !isSession(a)) return;
  delete a.tracker; a.wasExhausted = false;
  finish(a);
});
ipcMain.handle('tracker:update', (_e, { id, patch }) => withTracker(id, (t, now) => providers.trackerPatch(t, patch || {}, now)));
ipcMain.handle('tracker:add', (_e, { id, n }) => withTracker(id, (t, now) => providers.trackerAdd(t, n, now)));
ipcMain.handle('tracker:start', (_e, id) => withTracker(id, (t, now) => providers.trackerStart(t, now)));
ipcMain.handle('tracker:reset', (_e, id) => withTracker(id, (t, now) => providers.trackerReset(t, now)));

ipcMain.handle('settings:set', (_e, patch) => {
  if (patch && (patch.lang === 'en' || patch.lang === 'fa')) store.settings.lang = patch.lang;
  if (patch && patch.intervalMin != null) { store.settings.intervalMin = Math.min(120, Math.max(1, Number(patch.intervalMin) || 5)); schedule(); }
  save(); push();
});
ipcMain.handle('update:state', () => upd);
ipcMain.handle('update:check', () => checkUpdates());
ipcMain.handle('update:install', () => { if (canUpdate()) autoUpdater.quitAndInstall(true, true); });

// ---------------------------------------------------------------- start-up
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(() => {
    load();
    createWindow();
    initUpdater();
    schedule();
    setTimeout(refreshAll, 800);
    // every minute: roll tracker windows over, notify when a limit has reset, update the UI
    setInterval(() => store.accounts.filter(a => a.tracker).forEach(finish), 60 * 1000);
  });
  app.on('window-all-closed', () => app.quit());
}
