// Set HALO_MUSIC_VERSION in the Pages environment for every release. The
// neutral fallback prevents a stale hard-coded version from being published.
const CURRENT_VERSION = "0.0.0";
const DEFAULT_RELEASE_NOTES = [
  "优化播放体验",
  "修复部分歌曲无法播放的问题",
  "优化移动端界面"
];

function parseReleaseNotes(value) {
  if (!value) return DEFAULT_RELEASE_NOTES;
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) {
      const notes = parsed.map((note) => String(note).trim()).filter(Boolean);
      if (notes.length) return notes;
    }
  } catch {
    // Keep the built-in notes when the optional environment value is invalid.
  }
  return DEFAULT_RELEASE_NOTES;
}

export async function onRequestGet(context) {
  const env = context?.env || {};
  const version = String(env.HALO_MUSIC_VERSION || CURRENT_VERSION).trim() || CURRENT_VERSION;
  const apkUrl = String(
    env.HALO_MUSIC_ANDROID_URL
      || `https://github.com/zhoujungis/halo_music/releases/download/v${version}/HALO-Music-${version}.apk`
  ).trim();

  return new Response(JSON.stringify({
    version,
    releaseNotes: parseReleaseNotes(env.HALO_MUSIC_RELEASE_NOTES),
    android: {
      version,
      url: apkUrl
    }
  }), {
    headers: {
      "cache-control": "no-store, max-age=0",
      "content-type": "application/json; charset=utf-8"
    }
  });
}
