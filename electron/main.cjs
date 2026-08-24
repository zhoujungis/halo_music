const { app, BrowserWindow, shell } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("node:path");

const APP_URL = process.env.HALO_MUSIC_URL || "";
let mainWindow;

function resolveAppUrl() {
  const supplied = process.argv.find((argument) => argument.startsWith("--url="));
  return supplied ? supplied.slice("--url=".length) : APP_URL;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 920,
    minWidth: 960,
    minHeight: 640,
    show: false,
    autoHideMenuBar: true,
    backgroundColor: "#02030a",
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.once("ready-to-show", () => mainWindow.show());
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
  const appUrl = resolveAppUrl();
  if (appUrl) {
    mainWindow.loadURL(appUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, "..", "index.html"));
  }
}

function checkForUpdates() {
  if (!app.isPackaged) return;

  autoUpdater.autoDownload = true;
  autoUpdater.checkForUpdates().catch((error) => {
    console.error("HALO Music update check failed:", error);
  });
}

app.setAppUserModelId("com.halomusic.desktop");
app.whenReady().then(() => {
  createWindow();
  checkForUpdates();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
