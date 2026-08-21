const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("haloDesktop", {
  platform: process.platform,
  version: process.versions.electron,
});
