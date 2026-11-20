import { authenticatedUsername, isAdminUsername, json } from "./_auth.js";

async function adminUsername(request, env) {
  const username = await authenticatedUsername(request, env);
  if (!username) return { response: json({ error: "请先登录" }, 401) };
  if (!isAdminUsername(username, env)) return { response: json({ error: "无权访问管理页面" }, 403) };
  return { username };
}

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定（D1 binding 缺失）" }, 500);
  const auth = await adminUsername(request, env);
  if (auth.response) return auth.response;

  try {
    const [users, sessions, libraries, musicCache, searchCache, recentUsers, announcement] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) AS count FROM "user"').first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM music_sessions WHERE expires_at > ?").bind(Date.now()).first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM music_libraries").first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM music_cache WHERE expires_at > ?").bind(Date.now()).first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM search_cache WHERE expires_at > ?").bind(Date.now()).first(),
      env.DB.prepare('SELECT username, created_at, last_login_at FROM "user" ORDER BY created_at DESC LIMIT 50').all(),
      env.DB.prepare("SELECT content, updated_at FROM announcements WHERE id = 1").first().catch(() => null),
    ]);
    return json({
      ok: true,
      admin: auth.username,
      stats: {
        users: Number(users?.count || 0),
        activeSessions: Number(sessions?.count || 0),
        libraries: Number(libraries?.count || 0),
        musicCache: Number(musicCache?.count || 0),
        searchCache: Number(searchCache?.count || 0),
      },
      announcement: {
        content: String(announcement?.content || ""),
        updatedAt: Number(announcement?.updated_at) || null,
      },
      recentUsers: recentUsers?.results || [],
    });
  } catch (error) {
    console.error("Admin dashboard query failed", error);
    return json({ error: "管理数据读取失败" }, 500);
  }
}

export async function onRequestPut({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定（D1 binding 缺失）" }, 500);
  const auth = await adminUsername(request, env);
  if (auth.response) return auth.response;

  let body;
  try { body = await request.json(); }
  catch { return json({ error: "请求格式错误" }, 400); }

  const content = String(body?.content ?? "").trim().slice(0, 300);
  const updatedAt = Date.now();
  try {
    await env.DB.prepare(
      `INSERT INTO announcements (id, content, updated_at) VALUES (1, ?, ?)
       ON CONFLICT(id) DO UPDATE SET content = excluded.content, updated_at = excluded.updated_at`,
    ).bind(content, updatedAt).run();
  } catch (error) {
    console.error("announcement save failed", error);
    return json({ error: "公告保存失败，请确认数据表已创建" }, 500);
  }
  return json({ ok: true, content, updatedAt });
}
