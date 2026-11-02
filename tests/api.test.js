import test from "node:test";
import assert from "node:assert/strict";
import { onRequestGet } from "../functions/api/music.js";

test("playback actions are public and only require the playback service", async () => {
  const request = new Request("https://example.test/api/music?action=bili_audio&aid=123");
  const response = await onRequestGet({ request, env: {} });
  assert.equal(response.status, 503);
});
