import { authenticatedUsername, json } from "./_auth.js";

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定（D1 binding 缺失）" }, 500);
  const username = await authenticatedUsername(request, env);
  if (!username) return json({ username: null }, 401);
  return json({ username });
}
