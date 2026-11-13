const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("haloLyrics", {
  onUpdate: (callback) => {
    ipcRenderer.on("halo-lyrics:update", (_event, state) => callback(state));
  },
  ready: () => ipcRenderer.send("halo-lyrics:ready"),
  close: () => ipcRenderer.send("halo-lyrics:close"),
});
