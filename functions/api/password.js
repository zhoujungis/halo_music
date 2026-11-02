import { authenticatedUsername, hashPassword, json } from "./_auth.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定" }, 500);
  const username = await authenticatedUsername(request, env);
  if (!username) return json({ error: "请先登录" }, 401);
  let body;
  try { body = await request.json(); }
  catch { return json({ error: "请求格式错误" }, 400); }
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");
  if (newPassword.length < 8 || newPassword.length > 128) return json({ error: "新密码长度需为 8–128 位" }, 400);
  const row = await env.DB.prepare('SELECT password_hash, password_salt FROM "user" WHERE username = ?').bind(username).first();
  if (!row || await hashPassword(currentPassword, row.password_salt) !== row.password_hash) return json({ error: "当前密码不正确" }, 401);
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt, (byte) => byte.toString(16).padStart(2, "0")).join("");
  const passwordHash = await hashPassword(newPassword, saltHex);
  await env.DB.prepare('UPDATE "user" SET password_hash = ?, password_salt = ? WHERE username = ?').bind(passwordHash, saltHex, username).run();
  return json({ ok: true });
}
