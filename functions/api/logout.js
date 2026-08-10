import { clearSessionCookie, json, parseCookie, SESSION_COOKIE } from "./_auth.js";

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定（D1 binding 缺失）" }, 500);
  const token = parseCookie(request.headers.get("cookie"))[SESSION_COOKIE];
  if (token) await env.DB.prepare("DELETE FROM music_sessions WHERE token = ?").bind(token).run();
  return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie() });
}
