import { createPasswordSalt, hashPassword, json, sessionCookie, SESSION_TTL_MS } from "./_auth.js";

async function register({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定（D1 binding 缺失）" }, 500);

  let body;
  try { body = await request.json(); }
  catch { return json({ error: "请求格式错误" }, 400); }

  const username = String(body.username || "").trim();
  const password = body.password || "";
  if (!/^[A-Za-z0-9_\u4e00-\u9fa5]{3,20}$/.test(username)) {
    return json({ error: "用户名需为 3-20 位字母、数字、下划线或中文" }, 400);
  }
  if (typeof password !== "string" || password.length < 8) {
    return json({ error: "密码至少 8 位" }, 400);
  }

  const existing = await env.DB.prepare("SELECT username FROM music_users WHERE username = ?")
    .bind(username).first();
  if (existing) return json({ error: "该用户名已被注册" }, 409);

  const salt = createPasswordSalt();
  const passwordHash = await hashPassword(password, salt);
  const now = Date.now();

  try {
    await env.DB.prepare(
      "INSERT INTO music_users (username, password_hash, password_salt, created_at) VALUES (?, ?, ?, ?)",
    ).bind(username, passwordHash, salt, now).run();
  } catch (error) {
    if (String(error).includes("UNIQUE")) return json({ error: "该用户名已被注册" }, 409);
    throw error;
  }

  const token = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO music_sessions (token, username, expires_at) VALUES (?, ?, ?)",
  ).bind(token, username, now + SESSION_TTL_MS).run();

  return json({ ok: true, username }, 201, { "Set-Cookie": sessionCookie(token) });
}

export async function onRequestPost(context) {
  try {
    return await register(context);
  } catch (error) {
    console.error("Registration failed", error);
    return json({ error: "注册服务暂时不可用" }, 500);
  }
}
