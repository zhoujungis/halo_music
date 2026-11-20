import { json } from "./_auth.js";

// 公告内容为空（或还没写入）时返回 null，前端据此隐藏公告栏。
export async function onRequestGet({ env }) {
  if (!env?.DB) return json({ announcement: null });
  try {
    const row = await env.DB.prepare(
      "SELECT content, updated_at FROM announcements WHERE id = 1",
    ).first();
    const content = String(row?.content || "").trim();
    if (!content) return json({ announcement: null });
    return json({
      announcement: {
        content,
        updatedAt: Number(row.updated_at) || null,
      },
    });
  } catch (error) {
    console.warn("announcement read failed", error);
    return json({ announcement: null });
  }
}
