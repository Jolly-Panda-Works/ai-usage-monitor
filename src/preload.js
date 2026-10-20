const { contextBridge, ipcRenderer } = require('electron');
const inv = (c, a) => ipcRenderer.invoke(c, a);
contextBridge.exposeInMainWorld('api', {
  getState: () => inv('state:get'),
  appInfo: () => inv('app:info'),
  onState: cb => ipcRenderer.on('state', (_e, s) => cb(s)),
  add: (provider, label) => inv('account:add', { provider, label }),
  remove: id => inv('account:remove', id),
  login: id => inv('account:login', id),
  refresh: id => inv('account:refresh', id),
  refreshAll: () => inv('refresh:all'),
  manualUpdate: (id, patch) => inv('manual:update', { id, patch }),
  manualInc: (id, n) => inv('manual:inc', { id, n }),
  setSettings: p => inv('settings:set', p)
});
