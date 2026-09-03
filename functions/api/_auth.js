export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
export const SESSION_COOKIE = "hm_token";
const PASSWORD_ITERATIONS = 100000;

export function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=UTF-8", ...extraHeaders },
  });
}

export function parseCookie(header) {
  const output = {};
  if (!header) return output;
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    output[part.slice(0, separator).trim()] = decodeURIComponent(part.slice(separator + 1).trim());
  }
  return output;
}

function bytesToHex(bytes) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function hexToBytes(hex) {
  return new Uint8Array(hex.match(/.{1,2}/g).map((pair) => Number.parseInt(pair, 16)));
}

export function createPasswordSalt() {
  return bytesToHex(crypto.getRandomValues(new Uint8Array(16)));
}

export async function hashPassword(password, saltHex) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: hexToBytes(saltHex),
      iterations: PASSWORD_ITERATIONS,
      hash: "SHA-256",
    },
    material,
    256,
  );
  return bytesToHex(new Uint8Array(derived));
}

export function sessionCookie(token) {
  return [
    `${SESSION_COOKIE}=${token}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ].join("; ");
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

export async function authenticatedUsername(request, env) {
  const token = parseCookie(request.headers.get("cookie"))[SESSION_COOKIE];
  if (!token) return null;

  const session = await env.DB.prepare(
    "SELECT username, expires_at FROM music_sessions WHERE token = ?",
  ).bind(token).first();
  if (!session || session.expires_at <= Date.now()) {
    if (session) await env.DB.prepare("DELETE FROM music_sessions WHERE token = ?").bind(token).run();
    return null;
  }
  return session.username;
}

export function isAdminUsername(username, env) {
  const configured = String(env?.ADMIN_USERNAMES || env?.ADMIN_USERNAME || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
  return Boolean(username && configured.includes(username));
}

export async function authenticatedAdmin(request, env) {
  const username = await authenticatedUsername(request, env);
  return username && isAdminUsername(username, env) ? username : null;
}
