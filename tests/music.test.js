import test from "node:test";
import assert from "node:assert/strict";
import {
  DOWNLOAD_DAILY_LIMIT,
  biliDurationSeconds,
  detectAudioContainer,
  downloadDayKey,
  downloadFilename,
  normalizeBiliSearchResults,
  normalizeQQOfficial,
  normalizeTimedLyric,
  resolveNeteaseUrl,
} from "../functions/api/music.js";

test("normalizes lyric timestamps and removes empty lines", () => {
  assert.equal(normalizeTimedLyric("[0:01] hello\\n[00:02.50]\\n[00:03]world"), "[00:01]hello\n[00:03]world");
});

test("detects common audio containers", () => {
  assert.equal(detectAudioContainer(new TextEncoder().encode("fLaC")), "flac");
  assert.equal(detectAudioContainer(new Uint8Array([0x49, 0x44, 0x33, 0x04])), "mpeg");
  assert.equal(detectAudioContainer(new TextEncoder().encode("RIFFxxxxWAVE")), "wav");
});

test("normalizes provider search results", () => {
  const songs = normalizeQQOfficial({ req: { data: { body: { song: { list: [{ mid: "abc12345", name: "Song", singer: [{ name: "Artist" }] }] } } } } });
  assert.equal(songs[0].mid, "abc12345");
  assert.equal(songs[0].artist, "Artist");
  assert.equal(biliDurationSeconds("1:02"), 62);
});

test("normalizes bilibili video rows", () => {
  const result = normalizeBiliSearchResults({ data: { result: [{ type: "video", bvid: "BV1abc123", title: "Song", author: "Artist", duration: "1:02" }] } }, "Song", "Artist", 62);
  assert.equal(result[0].bvid, "BV1abc123");
  assert.equal(result[0].duration, 62);
});

test("resolves Meting redirect URLs and tries the next provider", async () => {
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), redirect: options?.redirect });
    if (calls.length === 1) return new Response("unavailable", { status: 200 });
    return new Response(null, {
      status: 302,
      headers: { location: "https://cdn.example.test/song.mp3" },
    });
  };
  try {
    const url = await resolveNeteaseUrl("123", {
      NETEASE_SOURCE_URLS: "https://first.example.test/meting,https://second.example.test/meting",
    });
    assert.equal(url, "https://cdn.example.test/song.mp3");
    assert.equal(calls[0].redirect, "manual");
    assert.match(calls[1].url, /type=url/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("download quota resets on the Beijing calendar day", () => {
  assert.equal(DOWNLOAD_DAILY_LIMIT, 10);
  // 2026-04-11T15:59:59Z is 23:59:59 in UTC+8.
  assert.equal(downloadDayKey(Date.parse("2026-04-11T15:59:59Z")), "2026-04-11");
  // One second later it is already the next day in Beijing.
  assert.equal(downloadDayKey(Date.parse("2026-04-11T16:00:00Z")), "2026-04-12");
});

test("download filenames are sanitized and get an extension from the content type", () => {
  const mp3 = new Response("", { headers: { "content-type": "audio/mpeg" } });
  assert.equal(downloadFilename(mp3, '周杰伦 - 晴天 / live:"demo"'), "周杰伦 - 晴天 _ live_demo.mp3");

  const flac = new Response("", { headers: { "content-type": "audio/flac" } });
  assert.equal(downloadFilename(flac, "album.flac"), "album.flac");

  const unknown = new Response("", {});
  assert.equal(downloadFilename(unknown, "   "), "halo-music.mp3");
});
