import { hashPassword, json, sessionCookie, SESSION_TTL_MS } from "./_auth.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定（D1 binding 缺失）" }, 500);

  let body;
  try { body = await request.json(); }
  catch { return json({ error: "请求格式错误" }, 400); }

  const username = String(body.username || "").trim();
  const password = body.password || "";
  if (!username || !password) return json({ error: "用户名和密码不能为空" }, 400);

  const account = await env.DB.prepare(
    "SELECT username, password_hash, password_salt FROM music_users WHERE username = ?",
  ).bind(username).first();
  if (!account) return json({ error: "用户名不存在，请先注册" }, 404);

  const passwordHash = await hashPassword(password, account.password_salt);
  if (passwordHash !== account.password_hash) return json({ error: "密码错误" }, 401);

  const token = crypto.randomUUID();
  const now = Date.now();
  await env.DB.prepare(
    "INSERT INTO music_sessions (token, username, expires_at) VALUES (?, ?, ?)",
  ).bind(token, account.username, now + SESSION_TTL_MS).run();

  return json({ ok: true, username: account.username }, 200, { "Set-Cookie": sessionCookie(token) });
}
