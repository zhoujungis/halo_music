import {
  clientIp,
  isValidEmail,
  json,
  normalizeEmail,
  registrationIpHash,
} from "./_auth.js";
import {
  isEmailConfigured,
  randomVerificationCode,
  sendVerificationEmail,
  verificationCodeHash,
} from "./_email.js";

const CODE_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const EMAIL_WINDOW_LIMIT = 5;
const IP_WINDOW_LIMIT = 10;

function retryResponse(seconds, error) {
  return json({ error, retryAfter: seconds }, 429, { "Retry-After": String(seconds) });
}

async function readRateLimit(env, key, limit, now) {
  const row = await env.DB.prepare(
    "SELECT window_started_at, count FROM auth_rate_limits WHERE key = ?",
  ).bind(key).first();
  if (!row) return { allowed: true };
  if (now - Number(row.window_started_at) >= RATE_WINDOW_MS) return { allowed: true };
  if (Number(row.count) < limit) return { allowed: true };
  const retryAfter = Math.max(1, Math.ceil((Number(row.window_started_at) + RATE_WINDOW_MS - now) / 1000));
  return { allowed: false, retryAfter };
}

async function incrementRateLimit(env, key, now) {
  await env.DB.prepare(`
    INSERT INTO auth_rate_limits (key, window_started_at, count) VALUES (?, ?, 1)
    ON CONFLICT(key) DO UPDATE SET
      count = CASE WHEN auth_rate_limits.window_started_at > ? THEN auth_rate_limits.count + 1 ELSE 1 END,
      window_started_at = CASE WHEN auth_rate_limits.window_started_at > ? THEN auth_rate_limits.window_started_at ELSE excluded.window_started_at END
  `).bind(key, now, now - RATE_WINDOW_MS, now - RATE_WINDOW_MS).run();
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定（D1 binding 缺失）" }, 500);
  if (!isEmailConfigured(env)) {
    return json({ error: "邮件服务尚未配置，请联系管理员" }, 503);
  }

  let body;
  try { body = await request.json(); }
  catch { return json({ error: "请求格式错误" }, 400); }

  const email = normalizeEmail(body.email);
  if (!isValidEmail(email)) return json({ error: "请输入有效的邮箱地址" }, 400);

  const ipHash = await registrationIpHash(clientIp(request), env);
  const now = Date.now();

  await env.DB.batch([
    env.DB.prepare("DELETE FROM email_verification_codes WHERE expires_at < ?").bind(now - 60 * 60 * 1000),
    env.DB.prepare("DELETE FROM auth_rate_limits WHERE window_started_at < ?").bind(now - 24 * 60 * 60 * 1000),
  ]).catch(() => {});

  try {
    const account = await env.DB.prepare('SELECT username FROM "user" WHERE email = ?')
      .bind(email).first();
    if (account) return json({ error: "该邮箱已注册，请直接登录" }, 409);

    const existing = await env.DB.prepare(
      "SELECT created_at FROM email_verification_codes WHERE email = ? AND purpose = 'register'",
    ).bind(email).first();
    if (existing) {
      const elapsed = now - Number(existing.created_at || 0);
      if (elapsed < RESEND_COOLDOWN_MS) {
        return retryResponse(Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000), "验证码发送过于频繁，请稍后再试");
      }
    }

    const emailLimit = await readRateLimit(env, `email:${email}`, EMAIL_WINDOW_LIMIT, now);
    if (!emailLimit.allowed) return retryResponse(emailLimit.retryAfter, "该邮箱验证码发送次数过多，请稍后再试");

    const ipLimit = await readRateLimit(env, `ip:${ipHash}`, IP_WINDOW_LIMIT, now);
    if (!ipLimit.allowed) return retryResponse(ipLimit.retryAfter, "当前网络请求过于频繁，请稍后再试");

    const code = randomVerificationCode();
    const codeHash = await verificationCodeHash(email, code);

    await env.DB.prepare(`
      INSERT INTO email_verification_codes
        (email, purpose, code_hash, request_ip, expires_at, created_at, attempts)
      VALUES (?, 'register', ?, ?, ?, ?, 0)
      ON CONFLICT(email, purpose) DO UPDATE SET
        code_hash = excluded.code_hash,
        request_ip = excluded.request_ip,
        expires_at = excluded.expires_at,
        created_at = excluded.created_at,
        attempts = 0
    `).bind(email, codeHash, ipHash, now + CODE_TTL_MS, now).run();

    try {
      await sendVerificationEmail(env, email, code);
    } catch (error) {
      console.error("Verification email failed", error);
      await env.DB.prepare("DELETE FROM email_verification_codes WHERE email = ? AND purpose = 'register'")
        .bind(email).run().catch(() => {});
      return json({ error: "验证码邮件发送失败，请稍后重试" }, 502);
    }

    await Promise.all([
      incrementRateLimit(env, `email:${email}`, now),
      incrementRateLimit(env, `ip:${ipHash}`, now),
    ]).catch((error) => console.warn("Rate limit update failed", error));

    return json({
      ok: true,
      expiresIn: Math.floor(CODE_TTL_MS / 1000),
      cooldown: Math.floor(RESEND_COOLDOWN_MS / 1000),
    });
  } catch (error) {
    console.error("Verification code request failed", error);
    return json({ error: "注册服务未初始化，请先执行数据库迁移" }, 503);
  }
}
