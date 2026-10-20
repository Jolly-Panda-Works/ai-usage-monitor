const { app, BrowserWindow, ipcMain, session, Notification } = require('electron');
const path = require('path');
const fs = require('fs');
const providers = require('./providers');

let win;
let store = { accounts: [], settings: { intervalMin: 5 } };
const file = () => path.join(app.getPath('userData'), 'accounts.json');

function load() {
  try { store = { ...store, ...JSON.parse(fs.readFileSync(file(), 'utf8')) }; } catch {}
}
function save() { try { fs.writeFileSync(file(), JSON.stringify(store, null, 2)); } catch {} }
function push() { if (win && !win.isDestroyed()) win.webContents.send('state', store); }

function cleanUA() {
  return app.userAgentFallback.replace(/ Electron\/\S+/, '').replace(/ ai-usage-monitor\/\S+/i, '').replace(/ AI-Usage-Monitor\/\S+/i, '');
}
function sesFor(acc) {
  const ses = session.fromPartition(acc.partition);
  ses.setUserAgent(cleanUA());
  return ses;
}

function exhausted(d) { return d && d.windows && d.windows.some(w => w.usedPct >= 100); }

async function refresh(acc) {
  const prev = acc.data;
  try {
    acc.data = await providers[acc.provider].fetch(sesFor(acc), acc);
    acc.data.error = null;
  } catch (e) {
    acc.data = { ...(prev || {}), error: e.message };
  }
  acc.data.updatedAt = Date.now();
  if (exhausted(prev) && acc.data.windows && !exhausted(acc.data) && Notification.isSupported()) {
    new Notification({ title: 'AI Usage Monitor', body: `${acc.label} دوباره قابل استفاده است ✅` }).show();
  }
  save(); push();
}
const refreshAll = () => Promise.all(store.accounts.map(refresh));

let timer;
function schedule() {
  clearInterval(timer);
  timer = setInterval(refreshAll, Math.max(1, store.settings.intervalMin) * 60 * 1000);
}

function createWindow() {
  win = new BrowserWindow({
    width: 1050, height: 780, minWidth: 720, minHeight: 520,
    title: 'AI Usage Monitor', backgroundColor: '#0f1115', autoHideMenuBar: true,
    webPreferences: { preload: path.join(__dirname, 'preload.js'), contextIsolation: true, nodeIntegration: false }
  });
  win.loadFile(path.join(__dirname, 'index.html'));
}

function openLogin(acc) {
  const p = providers[acc.provider];
  const w = new BrowserWindow({
    width: 1000, height: 780, title: `ورود - ${acc.label}`, autoHideMenuBar: true,
    webPreferences: { partition: acc.partition, contextIsolation: true, nodeIntegration: false }
  });
  w.webContents.setUserAgent(cleanUA());
  w.loadURL(p.loginUrl);
  w.on('closed', () => refresh(acc));
}

const find = id => store.accounts.find(a => a.id === id);

ipcMain.handle('state:get', () => store);
ipcMain.handle('account:add', (_e, { provider, label }) => {
  if (!providers[provider]) return;
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const acc = { id, provider, label: label || providers[provider].name, partition: 'persist:acct-' + id, data: null };
  if (providers[provider].defaultPeriodHours) {
    const ph = providers[provider].defaultPeriodHours;
    acc.manual = { label: 'سهمیه', limit: 100, used: 0, periodHours: ph, resetsAt: Date.now() + ph * 3600e3 };
  }
  store.accounts.push(acc);
  save(); push();
  openLogin(acc);
});
ipcMain.handle('account:remove', async (_e, id) => {
  const acc = find(id); if (!acc) return;
  try { await session.fromPartition(acc.partition).clearStorageData(); } catch {}
  store.accounts = store.accounts.filter(a => a.id !== id);
  save(); push();
});
ipcMain.handle('account:login', (_e, id) => { const a = find(id); if (a) openLogin(a); });
ipcMain.handle('account:refresh', (_e, id) => { const a = find(id); if (a) return refresh(a); });
ipcMain.handle('refresh:all', () => refreshAll());
ipcMain.handle('manual:update', (_e, { id, patch }) => {
  const a = find(id); if (!a || !a.manual) return;
  Object.assign(a.manual, patch);
  return refresh(a);
});
ipcMain.handle('manual:inc', (_e, { id, n }) => {
  const a = find(id); if (!a || !a.manual) return;
  a.manual.used = Math.max(0, (a.manual.used || 0) + n);
  return refresh(a);
});
ipcMain.handle('settings:set', (_e, patch) => { Object.assign(store.settings, patch); save(); schedule(); push(); });

app.whenReady().then(() => {
  load();
  createWindow();
  schedule();
  setTimeout(refreshAll, 800);
  setInterval(() => store.accounts.filter(a => a.manual).forEach(refresh), 60 * 1000);
});
app.on('window-all-closed', () => app.quit());
