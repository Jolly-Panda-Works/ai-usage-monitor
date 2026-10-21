const { contextBridge, ipcRenderer, clipboard } = require('electron');
const inv = (c, a) => ipcRenderer.invoke(c, a);
contextBridge.exposeInMainWorld('api', {
  getState: () => inv('state:get'),
  appInfo: () => inv('app:info'),
  onState: cb => ipcRenderer.on('state', (_e, s) => cb(s)),
  add: (provider, label) => inv('account:add', { provider, label }),
  remove: id => inv('account:remove', id),
  signIn: id => inv('account:signin', id),
  pairing: id => inv('account:pairing', id),
  openExtensionFolder: () => inv('ext:open'),
  manualUpdate: (id, patch) => inv('manual:update', { id, patch }),
  manualInc: (id, n) => inv('manual:inc', { id, n }),
  setSettings: p => inv('settings:set', p),
  copy: text => clipboard.writeText(String(text)),
  updateState: () => inv('update:state'),
  onUpdate: cb => ipcRenderer.on('update', (_e, s) => cb(s)),
  checkUpdates: () => inv('update:check'),
  installUpdate: () => inv('update:install')
});
