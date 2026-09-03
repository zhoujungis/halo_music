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
    const [users, sessions, libraries, musicCache, searchCache, recentUsers] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) AS count FROM "user"').first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM music_sessions WHERE expires_at > ?").bind(Date.now()).first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM music_libraries").first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM music_cache WHERE expires_at > ?").bind(Date.now()).first(),
      env.DB.prepare("SELECT COUNT(*) AS count FROM search_cache WHERE expires_at > ?").bind(Date.now()).first(),
      env.DB.prepare('SELECT username, created_at, last_login_at FROM "user" ORDER BY created_at DESC LIMIT 50').all(),
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
      recentUsers: recentUsers?.results || [],
    });
  } catch (error) {
    console.error("Admin dashboard query failed", error);
    return json({ error: "管理数据读取失败" }, 500);
  }
}
