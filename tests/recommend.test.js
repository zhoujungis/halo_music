import test from "node:test";
import assert from "node:assert/strict";
import { onRequestGet } from "../functions/api/recommend.js";

const SNAPSHOT = [
  { track_uid: "netease-1", title: "晴天", artist: "周杰伦", source: "netease", cover: "", plays: 9 },
  { track_uid: "netease-2", title: "稻香", artist: "周杰伦", source: "netease", cover: "", plays: 8 },
  { track_uid: "netease-3", title: "夜曲", artist: "周杰伦", source: "netease", cover: "", plays: 7 },
];

function createFakeDB(snapshot) {
  const calls = [];
  const db = {
    prepare(sql) {
      calls.push(sql);
      const statement = {
        bind(...params) {
          statement.params = params;
          return statement;
        },
        async first() {
          if (sql.includes("FROM toplist_cache")) {
            return snapshot ? { payload_json: JSON.stringify(snapshot) } : null;
          }
          return null;
        },
        async all() {
          return { results: [] };
        },
        async run() {
          return { meta: { changes: 1 } };
        },
      };
      return statement;
    },
  };
  return { db, calls };
}

test("guests read the daily global snapshot without aggregating history", async () => {
  const { db, calls } = createFakeDB(SNAPSHOT);
  const response = await onRequestGet({
    request: new Request("https://example.test/api/recommend?lang=zh"),
    env: { DB: db },
  });
  const body = await response.json();

  assert.equal(body.basis, "global");
  assert.deepEqual(body.tracks.map((track) => track.track_uid), SNAPSHOT.map((track) => track.track_uid));
  assert.equal(
    calls.some((sql) => sql.includes("music_play_history")),
    false,
    "request path must not scan the history table",
  );
});

test("missing snapshot falls back to the built-in recommendations", async () => {
  const { db } = createFakeDB(null);
  const response = await onRequestGet({
    request: new Request("https://example.test/api/recommend?lang=zh"),
    env: { DB: db },
  });
  const body = await response.json();

  assert.equal(body.basis, "default");
  assert.equal(body.tracks.length, 8);
});
