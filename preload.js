const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    selectDirectory: () => ipcRenderer.invoke('select-directory'),
    scanDirectory: () => ipcRenderer.invoke('scan-directory')
});