const { app, BrowserWindow, shell, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const fs = require("node:fs/promises");
const path = require("node:path");

const AUDIO_EXTENSIONS = [".mp3", ".m4a", ".flac", ".ogg", ".wav"];

function normalizedName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[\\/:*?"<>|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function downloadsDir() {
  return path.resolve(app.getPath("downloads"));
}

function isInsideDownloads(filePath) {
  const resolved = path.resolve(filePath);
  return resolved.startsWith(`${downloadsDir()}${path.sep}`);
}

// 先在默认下载目录里找「歌手 - 歌名」同名的音频文件。
ipcMain.handle("halo-local-track:find", async (_event, rawName) => {
  const target = normalizedName(rawName);
  if (!target) return null;
  let entries = [];
  try {
    entries = await fs.readdir(downloadsDir());
  } catch {
    return null;
  }
  const match = entries.find((entry) => {
    const extension = path.extname(entry).toLowerCase();
    if (!AUDIO_EXTENSIONS.includes(extension)) return false;
    const base = normalizedName(entry.slice(0, -extension.length));
    return base === target || base.includes(target) || target.includes(base);
  });
  return match ? { name: match, path: path.join(downloadsDir(), match) } : null;
});

// 把本地文件读给渲染进程，页面用 blob URL 播放，避开 file:// 的跨源限制。
ipcMain.handle("halo-local-track:read", async (_event, filePath) => {
  const target = String(filePath || "");
  if (!target || !isInsideDownloads(target)) return null;
  try {
    const data = await fs.readFile(target);
    return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  } catch {
    return null;
  }
});

const DEFAULT_APP_URL = "https://music.zhoujun.dev";
const APP_URL = process.env.HALO_MUSIC_URL || DEFAULT_APP_URL;
let mainWindow;

function resolveAppUrl() {
  const supplied = process.argv.find((argument) => argument.startsWith("--url="));
  const suppliedUrl = supplied ? supplied.slice("--url=".length).trim() : "";
  return suppliedUrl || APP_URL;
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
