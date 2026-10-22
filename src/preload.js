const { contextBridge, ipcRenderer, clipboard } = require('electron');
const inv = (c, a) => ipcRenderer.invoke(c, a);
contextBridge.exposeInMainWorld('api', {
  getState: () => inv('state:get'),
  appInfo: () => inv('app:info'),
  onState: cb => ipcRenderer.on('state', (_e, s) => cb(s)),
  add: (provider, label) => inv('account:add', { provider, label }),
  remove: id => inv('account:remove', id),
  refresh: id => inv('account:refresh', id),
  refreshAll: () => inv('refresh:all'),
  openSite: id => inv('account:site', id),
  detectFile: id => inv('source:detect', id),
  browseFile: id => inv('source:browse', id),
  setFile: (id, filePath) => inv('source:setFile', { id, filePath }),
  setCookie: (id, cookie, ua) => inv('source:setCookie', { id, cookie, ua }),
  pairing: id => inv('account:pairing', id),
  openExternal: url => inv('open:external', url),
  openExtensionFolder: () => inv('ext:open'),
  setManual: id => inv('source:setManual', id),
  manualUpdate: (id, patch) => inv('manual:update', { id, patch }),
  manualInc: (id, n) => inv('manual:inc', { id, n }),
  setSettings: p => inv('settings:set', p),
  copy: text => clipboard.writeText(String(text)),
  updateState: () => inv('update:state'),
  onUpdate: cb => ipcRenderer.on('update', (_e, s) => cb(s)),
  checkUpdates: () => inv('update:check'),
  installUpdate: () => inv('update:install')
});
