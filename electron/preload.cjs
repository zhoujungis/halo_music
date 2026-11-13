const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("haloDesktop", {
  platform: process.platform,
  version: process.versions.electron,
  findLocalTrack: (name) => ipcRenderer.invoke("halo-local-track:find", name),
  readLocalTrack: (filePath) => ipcRenderer.invoke("halo-local-track:read", filePath),
  toggleFloatingLyrics: (state) => ipcRenderer.invoke("halo-lyrics:toggle", state),
  updateFloatingLyrics: (state) => ipcRenderer.send("halo-lyrics:update", state),
  getFloatingLyricsState: () => ipcRenderer.invoke("halo-lyrics:state"),
  onFloatingLyricsState: (callback) => {
    ipcRenderer.on("halo-lyrics:state", (_event, state) => callback(state));
  },
});
