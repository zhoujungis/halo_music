const { app, BrowserWindow, shell, ipcMain, screen } = require("electron");
const { autoUpdater } = require("electron-updater");
const fs = require("node:fs/promises");
const fsSync = require("node:fs");
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
let lyricsWindow = null;
let lastLyricsState = null;
let appQuitting = false;

function lyricsBoundsFile() {
  return path.join(app.getPath("userData"), "lyrics-window.json");
}

function readLyricsBounds() {
  try {
    const raw = JSON.parse(fsSync.readFileSync(lyricsBoundsFile(), "utf8"));
    if (raw && Number.isFinite(raw.width) && Number.isFinite(raw.height)) return raw;
  } catch {}
  return null;
}

function saveLyricsBounds() {
  if (!lyricsWindow || lyricsWindow.isDestroyed()) return;
  try {
    fsSync.mkdirSync(path.dirname(lyricsBoundsFile()), { recursive: true });
    fsSync.writeFileSync(lyricsBoundsFile(), JSON.stringify(lyricsWindow.getBounds()));
  } catch {}
}

function defaultLyricsBounds() {
  const area = screen.getPrimaryDisplay().workArea;
  const width = 520;
  const height = 170;
  return {
    width,
    height,
    x: Math.round(area.x + area.width - width - 40),
    y: Math.round(area.y + area.height - height - 90),
  };
}

function clampLyricsBounds(bounds) {
  const area = screen.getPrimaryDisplay().workArea;
  return {
    width: Math.max(360, Math.min(bounds.width || 520, area.width)),
    height: Math.max(120, Math.min(bounds.height || 170, area.height)),
    x: Math.max(area.x, Math.min(bounds.x ?? 0, area.x + area.width - 80)),
    y: Math.max(area.y, Math.min(bounds.y ?? 0, area.y + area.height - 60)),
  };
}

function notifyLyricsVisibility(visible) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("halo-lyrics:state", { visible });
  }
}

function createLyricsWindow() {
  const bounds = clampLyricsBounds(readLyricsBounds() || defaultLyricsBounds());
  lyricsWindow = new BrowserWindow({
    ...bounds,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: "#00000000",
    hasShadow: false,
    resizable: true,
    movable: true,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    title: "HALO Lyrics",
    webPreferences: {
      preload: path.join(__dirname, "lyrics-preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  lyricsWindow.setAlwaysOnTop(true, "screen-saver");
  lyricsWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  lyricsWindow.setMenuBarVisibility(false);
  lyricsWindow.loadFile(path.join(__dirname, "lyrics-overlay.html"));
  lyricsWindow.on("moved", saveLyricsBounds);
  lyricsWindow.on("resized", saveLyricsBounds);
  lyricsWindow.on("close", (event) => {
    if (appQuitting) return;
    event.preventDefault();
    lyricsWindow.hide();
    notifyLyricsVisibility(false);
  });
  lyricsWindow.on("closed", () => {
    lyricsWindow = null;
  });
  lyricsWindow.webContents.on("did-finish-load", () => {
    if (lastLyricsState) lyricsWindow.webContents.send("halo-lyrics:update", lastLyricsState);
  });
}

ipcMain.handle("halo-lyrics:toggle", (_event, state) => {
  if (state) lastLyricsState = state;
  if (!lyricsWindow || lyricsWindow.isDestroyed()) createLyricsWindow();
  if (lyricsWindow.isVisible()) {
    lyricsWindow.hide();
    notifyLyricsVisibility(false);
    return false;
  }
  lyricsWindow.showInactive();
  lyricsWindow.setAlwaysOnTop(true, "screen-saver");
  if (lastLyricsState) lyricsWindow.webContents.send("halo-lyrics:update", lastLyricsState);
  notifyLyricsVisibility(true);
  return true;
});

ipcMain.on("halo-lyrics:update", (_event, state) => {
  lastLyricsState = state;
  if (lyricsWindow && !lyricsWindow.isDestroyed() && lyricsWindow.isVisible()) {
    lyricsWindow.webContents.send("halo-lyrics:update", state);
  }
});

ipcMain.handle("halo-lyrics:state", () => ({
  visible: Boolean(lyricsWindow && !lyricsWindow.isDestroyed() && lyricsWindow.isVisible()),
}));

ipcMain.on("halo-lyrics:ready", () => {
  if (lyricsWindow && lastLyricsState) {
    lyricsWindow.webContents.send("halo-lyrics:update", lastLyricsState);
  }
});

ipcMain.on("halo-lyrics:close", () => {
  if (lyricsWindow && !lyricsWindow.isDestroyed()) lyricsWindow.hide();
  notifyLyricsVisibility(false);
});

app.on("before-quit", () => {
  appQuitting = true;
});

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
