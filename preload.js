const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  providers: () => ipcRenderer.invoke('providers:list'),
  accounts: () => ipcRenderer.invoke('accounts:list'),
  add: (payload) => ipcRenderer.invoke('accounts:add', payload),
  remove: (id) => ipcRenderer.invoke('accounts:remove', id),
  fetchUsage: (id) => ipcRenderer.invoke('usage:fetch', id),
  readLocal: (type) => ipcRenderer.invoke('provider:readLocal', type),
  openExternal: (url) => ipcRenderer.invoke('open:external', url),
});
