import { authenticatedUsername, json } from "./_auth.js";

async function requireUser(request, env) {
  if (!env.DB) return { response: json({ error: "数据库未绑定" }, 500) };
  const username = await authenticatedUsername(request, env);
  return username ? { username } : { response: json({ error: "请先登录" }, 401) };
}

export async function onRequestGet({ request, env }) {
  const auth = await requireUser(request, env);
  if (auth.response) return auth.response;
  const row = await env.DB.prepare('SELECT username, display_name, avatar_url, created_at FROM "user" WHERE username = ?').bind(auth.username).first();
  if (!row) return json({ error: "账号不存在" }, 404);
  return json({ profile: row });
}

export async function onRequestPatch({ request, env }) {
  const auth = await requireUser(request, env);
  if (auth.response) return auth.response;
  let body;
  try { body = await request.json(); }
  catch { return json({ error: "请求格式错误" }, 400); }

  const displayName = String(body.displayName || "").trim();
  const newUsername = String(body.username || auth.username).trim();
  const avatarUrl = String(body.avatarUrl || "").trim();
  if (!/^[\p{L}\p{N}_]{3,20}$/u.test(newUsername)) return json({ error: "用户名需为 3–20 位字母、数字、下划线或中文" }, 400);
  if (displayName.length && (displayName.length < 2 || displayName.length > 20)) return json({ error: "昵称需为 2–20 个字符" }, 400);
  if (avatarUrl.length > 1000) return json({ error: "头像地址过长" }, 400);
  if (avatarUrl) {
    try {
      const parsed = new URL(avatarUrl);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('protocol');
    } catch { return json({ error: "头像请使用有效的 HTTP 或 HTTPS 图片地址" }, 400); }
  }

  const account = await env.DB.prepare('SELECT username FROM "user" WHERE username = ?').bind(auth.username).first();
  if (!account) return json({ error: "账号不存在" }, 404);
  const statements = [];
  if (newUsername !== auth.username) {
    statements.push(
      env.DB.prepare('INSERT INTO "user" (username, email, display_name, avatar_url, google_sub, password_hash, password_salt, created_at, last_login_at) SELECT ?, email, ?, ?, google_sub, password_hash, password_salt, created_at, last_login_at FROM "user" WHERE username = ?')
        .bind(newUsername, displayName || newUsername, avatarUrl || null, auth.username),
      env.DB.prepare('INSERT INTO music_libraries (username, library_json, updated_at) SELECT ?, library_json, updated_at FROM music_libraries WHERE username = ?').bind(newUsername, auth.username),
      env.DB.prepare('INSERT INTO music_play_history (username, track_uid, title, artist, played_at) SELECT ?, track_uid, title, artist, played_at FROM music_play_history WHERE username = ?').bind(newUsername, auth.username),
      env.DB.prepare('UPDATE music_sessions SET username = ? WHERE username = ?').bind(newUsername, auth.username),
      env.DB.prepare('UPDATE registration_ips SET username = ? WHERE username = ?').bind(newUsername, auth.username),
    );
    statements.push(env.DB.prepare('DELETE FROM "user" WHERE username = ?').bind(auth.username));
  } else {
    statements.push(env.DB.prepare('UPDATE "user" SET display_name = ?, avatar_url = ? WHERE username = ?').bind(displayName || auth.username, avatarUrl || null, auth.username));
  }
  try { await env.DB.batch(statements); }
  catch (error) {
    console.error("Profile update failed", error);
    const nameTaken = newUsername !== auth.username
      ? await env.DB.prepare('SELECT username FROM "user" WHERE username = ?').bind(newUsername).first().catch(() => null)
      : null;
    if (nameTaken) return json({ error: "该用户名已被使用" }, 409);
    return json({ error: "资料保存失败，请稍后重试" }, 409);
  }
  return json({ ok: true, username: newUsername });
}
