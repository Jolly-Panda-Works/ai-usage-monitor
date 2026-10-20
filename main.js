const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const crypto = require('crypto');
const store = require('./store');
const { TYPES, fetchUsage } = require('./providers');

if (!app.requestSingleInstanceLock()) app.quit();

function createWindow() {
  const win = new BrowserWindow({
    width: 1120,
    height: 780,
    minWidth: 720,
    minHeight: 520,
    backgroundColor: '#0f1115',
    title: 'AI Usage Monitor',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  win.loadFile(path.join(__dirname, 'renderer', 'index.html'));
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https:\/\//.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
}

function registerIpc() {
  ipcMain.handle('providers:list', () =>
    Object.fromEntries(Object.entries(TYPES).map(([k, v]) => [k, {
      label: v.label, vendor: v.vendor, help: v.help, hasLocal: !!v.localFile,
    }])));

  ipcMain.handle('accounts:list', () => store.list());

  ipcMain.handle('accounts:add', (_e, { type, name, input }) => {
    const t = TYPES[type];
    if (!t) throw new Error('نوع اکانت ناشناخته');
    const creds = t.normalize(String(input || ''));
    const id = crypto.randomUUID();
    store.add({ id, type, vendor: t.vendor, name: String(name || t.label).slice(0, 60) }, creds);
    return id;
  });

  ipcMain.handle('accounts:remove', (_e, id) => { store.remove(id); return true; });

  ipcMain.handle('usage:fetch', async (_e, id) => {
    const acc = store.get(id);
    if (!acc) return { status: 'error', error: 'اکانت پیدا نشد', fetchedAt: Date.now() };
    const creds = store.getCreds(id);
    return fetchUsage(acc.type, creds, { save: (c) => store.setCreds(id, c) });
  });

  ipcMain.handle('provider:readLocal', (_e, type) => {
    const t = TYPES[type];
    if (!t || !t.localFile) return null;
    try { return fs.readFileSync(path.join(os.homedir(), ...t.localFile), 'utf8'); } catch { return null; }
  });

  ipcMain.handle('open:external', (_e, url) => {
    if (/^https:\/\//.test(url)) shell.openExternal(url);
  });
}

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  registerIpc();
  createWindow();
});
app.on('window-all-closed', () => app.quit());
