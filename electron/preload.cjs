const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("haloDesktop", {
  platform: process.platform,
  version: process.versions.electron,
  findLocalTrack: (name) => ipcRenderer.invoke("halo-local-track:find", name),
  readLocalTrack: (filePath) => ipcRenderer.invoke("halo-local-track:read", filePath),
});
