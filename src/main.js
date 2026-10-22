const { app, BrowserWindow, ipcMain, session, Notification, shell, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const providers = require('./providers');
const { fetchUsage } = require('./fetchers');
const bridge = require('./bridge');

// Set this to the Chrome Web Store URL once the extension is published (shown in the Connect dialog).
const EXTENSION_STORE_URL = '';

let autoUpdater = null;
try { autoUpdater = require('electron-updater').autoUpdater; } catch {}

const ICON = path.join(__dirname, '..', 'assets', 'logo.png');
let win;
let bridgePort = null;
let store = { accounts: [], settings: { lang: 'en', intervalMin: 5 } };
const file = () => path.join(app.getPath('userData'), 'accounts.json');
const isProvider = k => !!(providers[k] && providers[k].name);

function load() {
  try {
    const d = JSON.parse(fs.readFileSync(file(), 'utf8'));
    store.accounts = (d.accounts || []).filter(a => isProvider(a.provider));
    store.settings = { ...store.settings, ...(d.settings || {}) };
  } catch {
    store.settings.lang = app.getLocale().toLowerCase().startsWith('fa') ? 'fa' : 'en';
  }
}
function save() { try { fs.writeFileSync(file(), JSON.stringify(store, null, 2)); } catch {} }
const publicState = () => ({
  settings: store.settings,
  accounts: store.accounts.map(({ token, ...a }) => ({ ...a, kind: providers[a.provider].kind }))
});
function push() { if (win && !win.isDestroyed()) win.webContents.send('state', publicState()); }

const cleanUA = () => app.userAgentFallback.replace(/ Electron\/\S+/, '').replace(/ ai-usage-monitor\/\S+/i, '').replace(/ AI-Usage-Monitor\/\S+/i, '');
function sesFor(acc) {
  const ses = session.fromPartition('persist:acct-' + acc.id);
  ses.setUserAgent((acc.source && acc.source.ua) || cleanUA());
  return ses;
}

const exhausted = d => d && d.windows && d.windows.some(w => w.usedPct >= 100);
function finish(prev, acc) {
  if (exhausted(prev) && acc.data.windows && !exhausted(acc.data) && Notification.isSupported()) {
    const fa = store.settings.lang === 'fa';
    new Notification({
      title: 'AI Usage Monitor',
      body: fa ? `${acc.label} دوباره قابل استفاده است ✅` : `${acc.label} is available again ✅`,
      icon: ICON
    }).show();
  }
  save(); push();
}

function refreshManual(acc) {
  const prev = acc.data;
  acc.data = { ...providers.manualUsage(acc), error: null, updatedAt: Date.now() };
  finish(prev, acc);
}

async function refresh(acc) {
  if (acc.manual) return refreshManual(acc);
  if (!acc.source || acc.source.type === 'extension') return;
  const prev = acc.data;
  const diag = [];
  try {
    acc.data = { ...(await fetchUsage(acc, sesFor(acc), diag)), error: null };
  } catch (e) {
    acc.data = { ...(prev || {}), error: e.message };
  }
  acc.data.diag = diag;
  acc.data.updatedAt = Date.now();
  finish(prev, acc);
}
const refreshAll = () => Promise.all(store.accounts.map(refresh));

let timer;
function schedule() {
  clearInterval(timer);
  timer = setInterval(refreshAll, Math.max(1, store.settings.intervalMin) * 60 * 1000);
}

// ---- browser extension: reports arrive on the local bridge ----
function onUsage(acc, data) {
  const prev = acc.data;
  acc.lastSeen = Date.now();
  acc.source = { type: 'extension' };
  delete acc.manual;
  if (data.error && !data.windows.length) acc.data = { ...(prev || {}), error: data.error };
  else acc.data = { email: data.email, plan: data.plan, windows: data.windows, note: data.note, error: data.error || null };
  acc.data.updatedAt = Date.now();
  finish(prev, acc);
}
function findByToken(tok) {
  const a = Buffer.from(String(tok));
  for (const acc of store.accounts) {
    if (!acc.token) continue;
    const b = Buffer.from(acc.token);
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) return acc;
  }
  return null;
}
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.writeFileSync(d, fs.readFileSync(s));
  }
}
// The extension is copied to a stable folder so "Load unpacked" keeps working after app updates.
const extensionDir = () => path.join(app.getPath('userData'), 'extension');
function installExtension() { try { copyDir(path.join(__dirname, '..', 'extension'), extensionDir()); } catch {} }

// ---- cookie method: the cookie you paste is placed in this account's private browser storage ----
async function seedCookies(acc, raw) {
  const p = providers[acc.provider];
  let s = String(raw || '').trim().replace(/^cookie:\s*/i, '').replace(/^["']|["']$/g, '');
  if (!s) throw new Error('EMPTY_COOKIE');
  let pairs;
  const single = /^([\w.\-]{1,60})=(.+)$/s.exec(s);
  if (s.includes(';')) pairs = s.split(/;\s*/).map(x => { const i = x.indexOf('='); return i > 0 ? [x.slice(0, i).trim(), x.slice(i + 1).trim()] : null; }).filter(Boolean);
  else if (single && !/^sk-ant-/.test(s)) pairs = [[single[1], single[2]]];
  else pairs = [[p.cookieName, s]];
  const ses = session.fromPartition('persist:acct-' + acc.id);
  await ses.clearStorageData({ storages: ['cookies'] });
  let n = 0;
  for (const [name, value] of pairs) {
    try {
      await ses.cookies.set({ url: p.cookieUrl, name, value, path: '/', secure: true, httpOnly: true, expirationDate: Math.floor(Date.now() / 1000) + 30 * 86400 });
      n++;
    } catch {}
  }
  if (!n) throw new Error('BAD_COOKIE');
}

// ---- auto-update (installer builds only) ----
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

const find = id => store.accounts.find(a => a.id === id);
const result = acc => ({ error: (acc.data && acc.data.error) || null, windows: ((acc.data && acc.data.windows) || []).length });

ipcMain.handle('state:get', () => publicState());
ipcMain.handle('app:info', () => ({ version: app.getVersion(), storeUrl: EXTENSION_STORE_URL }));
ipcMain.handle('account:add', (_e, { provider, label }) => {
  if (!isProvider(provider)) return null;
  const p = providers[provider];
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const acc = { id, provider, label: String(label || p.name).slice(0, 60), data: null };
  if (p.kind === 'manual') acc.manual = { label: 'Quota', limit: 100, used: 0, periodHours: p.defaultPeriodHours, resetsAt: Date.now() + p.defaultPeriodHours * 3600e3 };
  store.accounts.push(acc);
  if (acc.manual) refreshManual(acc); else { save(); push(); }
  return { id, kind: p.kind };
});
ipcMain.handle('account:remove', async (_e, id) => {
  const acc = find(id); if (!acc) return;
  try { await session.fromPartition('persist:acct-' + acc.id).clearStorageData(); } catch {}
  store.accounts = store.accounts.filter(a => a.id !== id);
  save(); push();
});
ipcMain.handle('account:refresh', (_e, id) => { const a = find(id); if (a) return refresh(a); });
ipcMain.handle('refresh:all', () => refreshAll());
// Sign-in always happens in the user's own browser, never inside this app.
ipcMain.handle('account:site', (_e, id) => { const a = find(id); if (a) shell.openExternal(providers[a.provider].loginUrl); });
ipcMain.handle('source:detect', (_e, id) => {
  const a = find(id); if (!a) return null;
  const p = providers.defaultFile(a.provider);
  return { path: p, exists: !!p && fs.existsSync(p) };
});
ipcMain.handle('source:browse', async (_e, id) => {
  const a = find(id); if (!a) return null;
  const def = providers.defaultFile(a.provider);
  const r = await dialog.showOpenDialog(win, {
    defaultPath: def ? path.dirname(def) : undefined,
    properties: ['openFile', 'showHiddenFiles'],
    filters: [{ name: 'JSON', extensions: ['json'] }, { name: 'All files', extensions: ['*'] }]
  });
  return r.canceled || !r.filePaths[0] ? null : { path: r.filePaths[0], exists: true };
});
ipcMain.handle('source:setFile', async (_e, { id, filePath }) => {
  const a = find(id); if (!a || providers[a.provider].kind !== 'auto' || typeof filePath !== 'string') return { error: 'NOT_CONNECTED', windows: 0 };
  a.source = { type: 'file', path: filePath };
  delete a.token; delete a.manual; a.data = null;
  await refresh(a);
  return result(a);
});
ipcMain.handle('source:setCookie', async (_e, { id, cookie, ua }) => {
  const a = find(id); if (!a || providers[a.provider].kind !== 'auto') return { error: 'NOT_CONNECTED', windows: 0 };
  try { await seedCookies(a, cookie); } catch (e) { return { error: e.message, windows: 0 }; }
  a.source = { type: 'cookie', ua: String(ua || '').trim().slice(0, 300) || undefined };
  delete a.token; delete a.manual; a.data = null;
  await refresh(a);
  return result(a);
});
ipcMain.handle('account:pairing', (_e, id) => {
  const a = find(id);
  if (!a || providers[a.provider].kind !== 'auto') return { error: 'NOT_CONNECTED' };
  if (!bridgePort) return { error: 'PORT' };
  if (!a.token) { a.token = crypto.randomBytes(24).toString('base64url'); save(); }
  const payload = { v: 1, p: bridgePort, t: a.token, s: a.provider, l: a.label };
  return { code: 'AUM1.' + Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url') };
});
ipcMain.handle('open:external', (_e, url) => { if (typeof url === 'string' && /^https:\/\//.test(url)) shell.openExternal(url); });
ipcMain.handle('ext:open', () => { installExtension(); return shell.openPath(extensionDir()); });
// Free quota tracker for accounts without usage meters (e.g. Free plans).
ipcMain.handle('source:setManual', (_e, id) => {
  const a = find(id); if (!a || providers[a.provider].kind !== 'auto') return { error: 'NOT_CONNECTED', windows: 0 };
  a.source = { type: 'manual' };
  delete a.token;
  a.manual = { label: 'Quota', limit: 100, used: 0, periodHours: 24, resetsAt: Date.now() + 24 * 3600e3 };
  a.data = null;
  refreshManual(a);
  return result(a);
});
ipcMain.handle('manual:update', (_e, { id, patch }) => {
  const a = find(id); if (!a || !a.manual) return;
  for (const k of ['label', 'limit', 'used', 'periodHours', 'resetsAt']) if (k in patch) a.manual[k] = k === 'label' ? String(patch[k]).slice(0, 40) : Number(patch[k]) || 0;
  refreshManual(a);
});
ipcMain.handle('manual:inc', (_e, { id, n }) => {
  const a = find(id); if (!a || !a.manual) return;
  a.manual.used = Math.max(0, (a.manual.used || 0) + (Number(n) || 0));
  refreshManual(a);
});
ipcMain.handle('settings:set', (_e, patch) => {
  if (patch && (patch.lang === 'en' || patch.lang === 'fa')) store.settings.lang = patch.lang;
  if (patch && Number.isFinite(Number(patch.intervalMin))) { store.settings.intervalMin = Math.min(120, Math.max(1, Number(patch.intervalMin))); schedule(); }
  save(); push();
});
ipcMain.handle('update:state', () => upd);
ipcMain.handle('update:check', () => checkUpdates());
ipcMain.handle('update:install', () => { if (canUpdate()) autoUpdater.quitAndInstall(true, true); });

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => { if (win) { if (win.isMinimized()) win.restore(); win.focus(); } });
  app.whenReady().then(async () => {
    load();
    installExtension();
    const b = await bridge.start({ findByToken, onUsage });
    bridgePort = b ? b.port : null;
    createWindow();
    schedule();
    initUpdater();
    setTimeout(refreshAll, 800);
    setInterval(() => { store.accounts.filter(a => a.manual).forEach(refreshManual); push(); }, 60 * 1000);
  });
  app.on('window-all-closed', () => app.quit());
}
