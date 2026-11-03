import test from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { DOWNLOAD_DAILY_LIMIT, beginDownload, downloadDayKey } from "../functions/api/music.js";

// Minimal D1-shaped adapter over node:sqlite so the real quota code is exercised.
function createEnv() {
  const db = new DatabaseSync(":memory:");
  db.exec(`
    CREATE TABLE "user" (username TEXT PRIMARY KEY);
    CREATE TABLE music_sessions (token TEXT PRIMARY KEY, username TEXT NOT NULL, expires_at INTEGER NOT NULL);
    CREATE TABLE music_downloads (
      username TEXT NOT NULL,
      platform TEXT NOT NULL,
      day TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY (username, platform, day)
    );
  `);
  db.exec(`INSERT INTO "user" (username) VALUES ('tester')`);
  db.prepare("INSERT INTO music_sessions (token, username, expires_at) VALUES (?, ?, ?)")
    .run("session-token", "tester", Date.now() + 3600_000);

  return {
    db,
    env: {
      DB: {
        prepare(sql) {
          let params = [];
          const statement = {
            bind(...args) {
              params = args;
              return statement;
            },
            async run() {
              const result = db.prepare(sql).run(...params);
              return { meta: { changes: Number(result.changes) } };
            },
            async first() {
              return db.prepare(sql).get(...params) ?? null;
            },
            async all() {
              return { results: db.prepare(sql).all(...params) };
            },
          };
          return statement;
        },
      },
    },
  };
}

const downloadRequest = (cookie) =>
  new Request("https://example.test/api/music?action=netease_audio&download=1", {
    headers: cookie ? { cookie } : {},
  });

test("plain playback requests are not treated as downloads", async () => {
  const { env } = createEnv();
  const request = new Request("https://example.test/api/music?action=netease_audio");
  assert.equal(await beginDownload(request, env, "netease"), null);
});

test("downloads require a signed-in account", async () => {
  const { env } = createEnv();
  const result = await beginDownload(downloadRequest(""), env, "netease");
  assert.ok(result instanceof Response);
  assert.equal(result.status, 401);
  assert.match((await result.json()).error, /登录/);
});

test("each platform gets its own daily allowance", async () => {
  const { env } = createEnv();
  const cookie = "hm_token=session-token";

  const first = await beginDownload(downloadRequest(cookie), env, "netease");
  assert.equal(first.remaining, DOWNLOAD_DAILY_LIMIT - 1);

  // A different platform starts from a full allowance.
  const otherPlatform = await beginDownload(downloadRequest(cookie), env, "qq");
  assert.equal(otherPlatform.remaining, DOWNLOAD_DAILY_LIMIT - 1);

  let lastGranted = null;
  for (let i = 1; i < DOWNLOAD_DAILY_LIMIT; i += 1) {
    lastGranted = await beginDownload(downloadRequest(cookie), env, "netease");
    assert.ok(!(lastGranted instanceof Response), `download ${i + 1} should be allowed`);
  }
  assert.equal(lastGranted.remaining, 0);

  const blocked = await beginDownload(downloadRequest(cookie), env, "netease");
  assert.ok(blocked instanceof Response);
  assert.equal(blocked.status, 429);
  const payload = await blocked.json();
  assert.equal(payload.remaining, 0);
  assert.equal(payload.limit, DOWNLOAD_DAILY_LIMIT);
});

test("yesterday's usage does not count against today", async () => {
  const { env, db } = createEnv();
  db.prepare(
    "INSERT INTO music_downloads (username, platform, day, count, updated_at) VALUES (?, ?, ?, ?, ?)",
  ).run("tester", "netease", "2026-04-10", DOWNLOAD_DAILY_LIMIT, Date.now());

  const granted = await beginDownload(downloadRequest("hm_token=session-token"), env, "netease");
  assert.equal(granted.day, downloadDayKey());
  assert.equal(granted.remaining, DOWNLOAD_DAILY_LIMIT - 1);
});
