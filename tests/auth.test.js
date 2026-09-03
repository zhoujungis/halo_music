import test from "node:test";
import assert from "node:assert/strict";
import { createPasswordSalt, hashPassword, parseCookie } from "../functions/api/_auth.js";

test("parseCookie ignores malformed percent-encoding", () => {
  assert.deepEqual(parseCookie("hm_token=%; theme=dark"), { theme: "dark" });
});

test("password hashing is salted and deterministic", async () => {
  const salt = createPasswordSalt();
  const first = await hashPassword("correct horse battery staple", salt);
  const second = await hashPassword("correct horse battery staple", salt);
  assert.equal(first, second);
  assert.notEqual(first, await hashPassword("wrong password", salt));
});
