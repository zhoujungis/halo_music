import { authenticatedUsername, clearSessionCookie, hashPassword, json } from "./_auth.js";

export async function onRequestDelete({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定" }, 500);
  const username = await authenticatedUsername(request, env);
  if (!username) return json({ error: "请先登录" }, 401);
  let body;
  try { body = await request.json(); }
  catch { return json({ error: "请求格式错误" }, 400); }
  const password = String(body.password || "");
  const account = await env.DB.prepare('SELECT password_hash, password_salt FROM "user" WHERE username = ?').bind(username).first();
  if (!account || await hashPassword(password, account.password_salt) !== account.password_hash) {
    return json({ error: "当前密码不正确" }, 401);
  }
  try {
    await env.DB.prepare("DELETE FROM registration_ips WHERE username = ?").bind(username).run().catch(() => {});
    await env.DB.prepare('DELETE FROM "user" WHERE username = ?').bind(username).run();
  } catch (error) {
    console.error("Account deletion failed", error);
    return json({ error: "注销失败，请稍后重试" }, 503);
  }
  return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
}
