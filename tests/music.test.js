import test from "node:test";
import assert from "node:assert/strict";
import {
  biliDurationSeconds,
  detectAudioContainer,
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
