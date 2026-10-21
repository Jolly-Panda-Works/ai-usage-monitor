const { app, BrowserWindow, ipcMain, Notification, shell } = require('electron');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const providers = require('./providers');
const bridge = require('./bridge');

let autoUpdater = null;
try { autoUpdater = require('electron-updater').autoUpdater; } catch {}

const ICON = path.join(__dirname, '..', 'assets', 'logo.png');
let win;
let bridgePort = null;
let store = { accounts: [], settings: { lang: 'en' } };
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
  for (const a of store.accounts) {
    delete a.partition; // older versions used embedded sign-in sessions
    if (providers[a.provider].kind === 'extension' && !a.token) a.token = crypto.randomBytes(24).toString('base64url');
  }
}
function save() { try { fs.writeFileSync(file(), JSON.stringify(store, null, 2)); } catch {} }
function publicState() {
  return {
    settings: store.settings,
    accounts: store.accounts.map(({ token, ...a }) => ({ ...a, kind: providers[a.provider].kind }))
  };
}
function push() { if (win && !win.isDestroyed()) win.webContents.send('state', publicState()); }

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

function onUsage(acc, data) {
  const prev = acc.data;
  acc.lastSeen = Date.now();
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

// ---- browser extension files: copied to a stable folder so "Load unpacked" keeps working ----
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyDir(s, d); else fs.writeFileSync(d, fs.readFileSync(s));
  }
}
const extensionDir = () => path.join(app.getPath('userData'), 'extension');
function installExtension() { try { copyDir(path.join(__dirname, '..', 'extension'), extensionDir()); } catch {} }

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

ipcMain.handle('state:get', () => publicState());
ipcMain.handle('app:info', () => ({ version: app.getVersion(), bridgePort }));
ipcMain.handle('account:add', (_e, { provider, label }) => {
  if (!isProvider(provider)) return null;
  const p = providers[provider];
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const acc = { id, provider, label: String(label || p.name).slice(0, 60), data: null };
  if (p.kind === 'extension') acc.token = crypto.randomBytes(24).toString('base64url');
  else acc.manual = { label: 'Quota', limit: 100, used: 0, periodHours: p.defaultPeriodHours, resetsAt: Date.now() + p.defaultPeriodHours * 3600e3 };
  store.accounts.push(acc);
  if (acc.manual) refreshManual(acc); else { save(); push(); }
  return { id, kind: p.kind };
});
ipcMain.handle('account:remove', (_e, id) => { store.accounts = store.accounts.filter(a => a.id !== id); save(); push(); });
// Sign-in always happens in the user's own browser, never inside this app.
ipcMain.handle('account:signin', (_e, id) => { const a = find(id); if (a) shell.openExternal(providers[a.provider].loginUrl); });
ipcMain.handle('account:pairing', (_e, id) => {
  const a = find(id);
  if (!a || !a.token) return { error: 'NO_TOKEN' };
  if (!bridgePort) return { error: 'PORT' };
  const payload = { v: 1, p: bridgePort, t: a.token, s: a.provider, l: a.label };
  return { code: 'AUM1.' + Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url') };
});
ipcMain.handle('ext:open', () => { installExtension(); return shell.openPath(extensionDir()); });
ipcMain.handle('manual:update', (_e, { id, patch }) => {
  const a = find(id); if (!a || !a.manual) return;
  const allowed = ['label', 'limit', 'used', 'periodHours', 'resetsAt'];
  for (const k of allowed) if (k in patch) a.manual[k] = k === 'label' ? String(patch[k]).slice(0, 40) : Number(patch[k]) || 0;
  refreshManual(a);
});
ipcMain.handle('manual:inc', (_e, { id, n }) => {
  const a = find(id); if (!a || !a.manual) return;
  a.manual.used = Math.max(0, (a.manual.used || 0) + (Number(n) || 0));
  refreshManual(a);
});
ipcMain.handle('settings:set', (_e, patch) => {
  if (patch && (patch.lang === 'en' || patch.lang === 'fa')) store.settings.lang = patch.lang;
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
    initUpdater();
    setInterval(() => { store.accounts.filter(a => a.manual).forEach(refreshManual); push(); }, 60 * 1000);
  });
  app.on('window-all-closed', () => app.quit());
}
