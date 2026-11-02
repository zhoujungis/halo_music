import test from "node:test";
import assert from "node:assert/strict";
import {
  createPasswordSalt,
  hashPassword,
  isValidEmail,
  isValidUsername,
  normalizeEmail,
  parseCookie,
  registrationIpHash,
  usernameFromEmail,
} from "../functions/api/_auth.js";
import { sendVerificationEmail, verificationCodeHash } from "../functions/api/_email.js";

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

test("normalizes and validates registration emails", () => {
  assert.equal(normalizeEmail("  User@Halo.TEST "), "user@halo.test");
  assert.equal(isValidEmail("user@halo.test"), true);
  assert.equal(isValidEmail("user@example"), false);
  assert.equal(isValidEmail("not an email"), false);
});

test("validates usernames for registration", () => {
  assert.equal(isValidUsername("halo_user"), true);
  assert.equal(isValidUsername("音乐用户"), true);
  assert.equal(isValidUsername("ab"), false);
  assert.equal(isValidUsername("bad name"), false);
  assert.equal(isValidUsername("a".repeat(21)), false);
});

test("derives a valid username from an email address", () => {
  assert.equal(usernameFromEmail("zhou.jun+halo@halo.test"), "zhoujunhalo");
  assert.equal(usernameFromEmail("a@halo.test"), "haloa");
  assert.equal(isValidUsername(usernameFromEmail("a@halo.test")), true);
});

test("registration IP hashes are stable per secret", async () => {
  const first = await registrationIpHash("203.0.113.9", { AUTH_SECRET: "secret-a" });
  const second = await registrationIpHash("203.0.113.9", { AUTH_SECRET: "secret-a" });
  const other = await registrationIpHash("203.0.113.9", { AUTH_SECRET: "secret-b" });
  assert.equal(first, second);
  assert.notEqual(first, other);
});

test("verification codes are hashed with their email", async () => {
  const first = await verificationCodeHash("user@halo.test", "123456");
  const second = await verificationCodeHash("user@halo.test", "123456");
  assert.equal(first, second);
  assert.notEqual(first, await verificationCodeHash("other@halo.test", "123456"));
});

test("resend payload uses the music domain sender address", async () => {
  const originalFetch = globalThis.fetch;
  let captured = null;
  globalThis.fetch = async (url, options) => {
    captured = { url, options };
    return new Response(JSON.stringify({ id: "mail_1" }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  };
  try {
    await sendVerificationEmail(
      {
        RESEND_API_KEY: "re_test",
        RESEND_SENDER_NAME: "HALO Music",
      },
      "user@halo.test",
      "123456",
    );
    assert.equal(captured.url, "https://api.resend.com/emails");
    const payload = JSON.parse(captured.options.body);
    assert.equal(payload.from, "HALO Music <no-reply@music.zhoujun.dev>");
    assert.deepEqual(payload.to, ["user@halo.test"]);
    assert.match(payload.subject, /123456/);
    assert.match(payload.html, /123456/);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
