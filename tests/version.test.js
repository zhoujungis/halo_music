import test from "node:test";
import assert from "node:assert/strict";
import { onRequestGet } from "../functions/api/version.js";

test("exposes Gitee mirror links only when configured", async () => {
  const response = await onRequestGet({
    env: { HALO_MUSIC_VERSION: "1.2.3", GITEE_OWNER: "halo", GITEE_REPO: "music" },
  });
  const body = await response.json();
  assert.equal(body.version, "1.2.3");
  assert.deepEqual(body.gitee, {
    releases: "https://gitee.com/halo/music/releases",
    windows: "https://gitee.com/halo/music/releases/download/latest/HALO-Music-Setup-x64.exe",
    android: "https://gitee.com/halo/music/releases/download/latest/HALO-Music.apk",
  });
});

test("omits Gitee links when the mirror is not configured", async () => {
  const response = await onRequestGet({ env: { HALO_MUSIC_VERSION: "1.2.3" } });
  const body = await response.json();
  assert.equal(body.gitee, null);
});
