import test from "node:test";
import assert from "node:assert/strict";
import { onRequestGet } from "../functions/api/music.js";

test("protected music actions require a session", async () => {
  const request = new Request("https://example.test/api/music?action=bili_audio&aid=123");
  const response = await onRequestGet({ request, env: { DB: {} } });
  assert.equal(response.status, 401);
});
