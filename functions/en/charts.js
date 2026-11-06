import { buildChartsHtml } from "../charts.js";

export async function onRequestGet({ env }) {
  const html = await buildChartsHtml(env, "en");
  return new Response(html, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
      "cache-control": "public, max-age=600",
    },
  });
}
