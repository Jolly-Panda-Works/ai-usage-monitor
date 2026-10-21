const { contextBridge, ipcRenderer, clipboard } = require('electron');
const inv = (c, a) => ipcRenderer.invoke(c, a);
contextBridge.exposeInMainWorld('api', {
  getState: () => inv('state:get'),
  appInfo: () => inv('app:info'),
  onState: cb => ipcRenderer.on('state', (_e, s) => cb(s)),
  add: (provider, label) => inv('account:add', { provider, label }),
  remove: id => inv('account:remove', id),
  signIn: id => inv('account:signin', id),
  openInBrowser: id => inv('account:browser', id),
  refresh: id => inv('account:refresh', id),
  refreshAll: () => inv('refresh:all'),
  setCookies: (id, input) => inv('account:cookies', { id, input }),
  trackerEnable: id => inv('tracker:enable', id),
  trackerDisable: id => inv('tracker:disable', id),
  trackerUpdate: (id, patch) => inv('tracker:update', { id, patch }),
  trackerAdd: (id, n) => inv('tracker:add', { id, n }),
  trackerStart: id => inv('tracker:start', id),
  trackerReset: id => inv('tracker:reset', id),
  setSettings: p => inv('settings:set', p),
  copy: text => clipboard.writeText(String(text)),
  updateState: () => inv('update:state'),
  onUpdate: cb => ipcRenderer.on('update', (_e, s) => cb(s)),
  checkUpdates: () => inv('update:check'),
  installUpdate: () => inv('update:install')
});
