const { app, safeStorage } = require('electron');
const fs = require('fs');
const path = require('path');

const file = () => path.join(app.getPath('userData'), 'accounts.json');

function read() {
  try { return JSON.parse(fs.readFileSync(file(), 'utf8')); } catch { return []; }
}
function write(list) {
  fs.mkdirSync(path.dirname(file()), { recursive: true });
  fs.writeFileSync(file(), JSON.stringify(list, null, 2));
}

// Credentials are encrypted with Windows DPAPI via Electron safeStorage.
function enc(obj) {
  const s = JSON.stringify(obj);
  return safeStorage.isEncryptionAvailable()
    ? 'e:' + safeStorage.encryptString(s).toString('base64')
    : 'p:' + Buffer.from(s).toString('base64');
}
function dec(t) {
  if (t.startsWith('e:')) return JSON.parse(safeStorage.decryptString(Buffer.from(t.slice(2), 'base64')));
  return JSON.parse(Buffer.from(t.slice(2), 'base64').toString());
}

module.exports = {
  list: () => read().map(({ secret, ...rest }) => rest),
  get: (id) => read().find((a) => a.id === id),
  add(meta, creds) {
    const list = read();
    list.push({ ...meta, secret: enc(creds) });
    write(list);
  },
  remove(id) { write(read().filter((a) => a.id !== id)); },
  getCreds(id) {
    const a = read().find((x) => x.id === id);
    return a ? dec(a.secret) : null;
  },
  setCreds(id, creds) {
    const list = read();
    const a = list.find((x) => x.id === id);
    if (a) { a.secret = enc(creds); write(list); }
  },
};
