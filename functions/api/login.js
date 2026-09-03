import { hashPassword, json, sessionCookie, SESSION_TTL_MS } from "./_auth.js";

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCK_MS = 15 * 60 * 1000;
const loginAttempts = new Map();
const DUMMY_SALT = "00000000000000000000000000000000";

function loginKey(request) {
  const ip = request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "unknown";
  // Limit by client address so changing usernames cannot bypass the lockout.
  return ip.split(",")[0].trim() || "unknown";
}

function retryAfterSeconds(key) {
  const entry = loginAttempts.get(key);
  const now = Date.now();
  if (!entry || now - entry.firstAt > LOGIN_WINDOW_MS) return 0;
  return entry.lockedUntil > now ? Math.ceil((entry.lockedUntil - now) / 1000) : 0;
}

function recordLoginFailure(key) {
  const now = Date.now();
  const entry = loginAttempts.get(key) || { firstAt: now, failures: 0, lockedUntil: 0 };
  if (now - entry.firstAt > LOGIN_WINDOW_MS) {
    entry.firstAt = now;
    entry.failures = 0;
  }
  entry.failures += 1;
  if (entry.failures >= LOGIN_MAX_ATTEMPTS) entry.lockedUntil = now + LOGIN_LOCK_MS;
  loginAttempts.set(key, entry);
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定（D1 binding 缺失）" }, 500);

  let body;
  try { body = await request.json(); }
  catch { return json({ error: "请求格式错误" }, 400); }

  const username = String(body.username || "").trim();
  const password = body.password || "";
  if (!username || !password) return json({ error: "用户名和密码不能为空" }, 400);
  const attemptKey = loginKey(request);
  const retryAfter = retryAfterSeconds(attemptKey);
  if (retryAfter) return json({ error: "Too many login attempts" }, 429, { "Retry-After": String(retryAfter) });

  let account;
  try {
    account = await env.DB.prepare(
      'SELECT username, password_hash, password_salt FROM "user" WHERE username = ?',
    ).bind(username).first();
  } catch (error) {
    console.error("Login account query failed", error);
    return json({ error: "账号服务未初始化，请先执行 schema.sql" }, 503);
  }
  const passwordHash = await hashPassword(password, account?.password_salt || DUMMY_SALT);
  if (!account || passwordHash !== account.password_hash) {
    recordLoginFailure(attemptKey);
    return json({ error: "用户名或密码错误" }, 401);
  }
  loginAttempts.delete(attemptKey);

  const token = crypto.randomUUID();
  const now = Date.now();
  try {
    await env.DB.prepare('UPDATE "user" SET last_login_at = ? WHERE username = ?')
      .bind(now, account.username).run();
    await env.DB.prepare(
      "INSERT INTO music_sessions (token, username, expires_at) VALUES (?, ?, ?)",
    ).bind(token, account.username, now + SESSION_TTL_MS).run();
  } catch (error) {
    console.error("Login session creation failed", error);
    return json({ error: "登录服务暂时不可用，请检查数据库表是否已初始化" }, 503);
  }

  return json({ ok: true, username: account.username }, 200, { "Set-Cookie": sessionCookie(token) });
}
