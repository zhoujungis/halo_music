/**
 * HALO Music - Storage Module
 * 统一管理 IndexedDB 本地离线音频缓存与 LocalStorage 持久化存储
 */

export const OFFLINE_DB_NAME = 'halo-music-offline';
export const OFFLINE_DB_VERSION = 1;
export const OFFLINE_STORE = 'tracks';
export const OFFLINE_COVER_CACHE = 'halo-covers-v1';
export const OFFLINE_LIBRARY_KEY = 'halo-music-offline-library-v1';

export const LIBRARY_STORAGE_KEY = 'halo-music-library-v1';
export const PLAY_QUEUE_STORAGE_KEY = 'halo-music-play-queue-v1';
export const THEME_STORAGE_KEY = 'halo-music-theme';
export const SEARCH_HISTORY_KEY = 'halo-music-search-history-v1';
export const SEARCH_HISTORY_LIMIT = 8;

let offlineDbPromise = null;

/**
 * 打开 IndexedDB 离线数据库
 */
export function openOfflineDb() {
  if (offlineDbPromise) return offlineDbPromise;
  offlineDbPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const request = window.indexedDB.open(OFFLINE_DB_NAME, OFFLINE_DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(OFFLINE_STORE)) {
        db.createObjectStore(OFFLINE_STORE, { keyPath: 'uid' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('IndexedDB open failed'));
  }).catch((error) => {
    offlineDbPromise = null;
    throw error;
  });
  return offlineDbPromise;
}

/**
 * 包装 IDBRequest 为 Promise
 */
export function idbRequest(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('IndexedDB request failed'));
  });
}

/**
 * 读取离线单曲记录
 */
export async function readOfflineTrack(uid) {
  if (!uid) return null;
  const db = await openOfflineDb();
  const tx = db.transaction(OFFLINE_STORE, 'readonly');
  const store = tx.objectStore(OFFLINE_STORE);
  return idbRequest(store.get(String(uid)));
}

/**
 * 保存离线单曲记录
 */
export async function saveOfflineTrack(record) {
  if (!record || !record.uid) return;
  const db = await openOfflineDb();
  const tx = db.transaction(OFFLINE_STORE, 'readwrite');
  const store = tx.objectStore(OFFLINE_STORE);
  await idbRequest(store.put(record));
}

/**
 * 删除离线单曲记录
 */
export async function deleteOfflineTrack(uid) {
  if (!uid) return;
  const db = await openOfflineDb();
  const tx = db.transaction(OFFLINE_STORE, 'readwrite');
  const store = tx.objectStore(OFFLINE_STORE);
  await idbRequest(store.delete(String(uid)));
}

/**
 * 列出所有离线单曲记录
 */
export async function listAllOfflineTracks() {
  const db = await openOfflineDb();
  const tx = db.transaction(OFFLINE_STORE, 'readonly');
  const store = tx.objectStore(OFFLINE_STORE);
  return idbRequest(store.getAll());
}

// 离线歌曲的本地镜像列表（在 LocalStorage 中备份，防止系统清理 IDB 时无感知）
let offlineMirrorRaw = null;
let offlineMirrorList = [];

export function readOfflineLibraryMirror() {
  try {
    const raw = localStorage.getItem(OFFLINE_LIBRARY_KEY) || '';
    if (raw === offlineMirrorRaw) return offlineMirrorList;
    const list = raw ? JSON.parse(raw) : [];
    offlineMirrorRaw = raw;
    offlineMirrorList = Array.isArray(list) ? list.filter((item) => item && item.uid) : [];
    return offlineMirrorList;
  } catch {
    offlineMirrorRaw = null;
    offlineMirrorList = [];
    return offlineMirrorList;
  }
}

export function writeOfflineLibraryMirror(list) {
  try {
    localStorage.setItem(OFFLINE_LIBRARY_KEY, JSON.stringify(list));
  } catch {}
  offlineMirrorRaw = null;
  offlineMirrorList = [];
}

export function rememberOfflineLibrary(track, extra = {}) {
  if (!track?.uid) return;
  const list = readOfflineLibraryMirror().filter((item) => item.uid !== track.uid);
  list.push({
    uid: track.uid,
    title: track.title || '',
    artist: track.artist || '',
    size: Number(extra.size) || 0,
    savedAt: Number(extra.savedAt) || Date.now(),
    track: extra.track || track
  });
  writeOfflineLibraryMirror(list);
}

export function forgetOfflineLibrary(uid) {
  const key = String(uid);
  writeOfflineLibraryMirror(readOfflineLibraryMirror().filter((item) => item.uid !== key));
}

// ===================== LocalStorage 搜索历史 =====================

export function readSearchHistory() {
  try {
    const raw = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]');
    return Array.isArray(raw)
      ? raw.map((item) => String(item || '').trim()).filter(Boolean).slice(0, SEARCH_HISTORY_LIMIT)
      : [];
  } catch {
    return [];
  }
}

export function addSearchHistory(term) {
  const cleanTerm = String(term || '').trim();
  if (!cleanTerm) return readSearchHistory();
  const list = readSearchHistory().filter((item) => item.toLowerCase() !== cleanTerm.toLowerCase());
  list.unshift(cleanTerm);
  const next = list.slice(0, SEARCH_HISTORY_LIMIT);
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(next));
  } catch {}
  return next;
}

export function removeSearchHistory(term) {
  const cleanTerm = String(term || '').trim().toLowerCase();
  const list = readSearchHistory().filter((item) => item.toLowerCase() !== cleanTerm);
  try {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(list));
  } catch {}
  return list;
}

export function clearSearchHistory() {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch {}
  return [];
}

// ===================== LocalStorage 队列与歌单 =====================

export function loadLocalQueue() {
  try {
    const raw = localStorage.getItem(PLAY_QUEUE_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalQueue(queue) {
  try {
    localStorage.setItem(PLAY_QUEUE_STORAGE_KEY, JSON.stringify(queue || []));
  } catch {}
}

export function loadLocalLibrary() {
  try {
    const raw = localStorage.getItem(LIBRARY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveLocalLibrary(data) {
  try {
    localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(data || {}));
  } catch {}
}

export function loadTheme() {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) || 'dark';
  } catch {
    return 'dark';
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
}
