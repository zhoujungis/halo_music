import {
  clientIp,
  createPasswordSalt,
  createSession,
  hashPassword,
  normalizeEmail,
  registrationIpHash,
  sessionCookie,
  usernameFromEmail,
} from "../../_auth.js";

const OAUTH_STATE_COOKIE = "hm_oauth_state";

function redirect(location, cookies = []) {
  const headers = new Headers({
    Location: location,
    "Cache-Control": "no-store",
  });
  for (const cookie of cookies) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 302, headers });
}

function clearStateCookie() {
  return `${OAUTH_STATE_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function parseCookies(header) {
  const cookies = {};
  if (!header) return cookies;
  for (const part of header.split(";")) {
    const index = part.indexOf("=");
    if (index < 0) continue;
    cookies[part.slice(0, index).trim()] = part.slice(index + 1).trim();
  }
  return cookies;
}

async function uniqueUsername(env, email) {
  const base = usernameFromEmail(email) || "halo";
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const suffix = String(1000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 9000));
    const candidate = attempt === 0 ? base : `${base.slice(0, 20 - suffix.length)}${suffix}`;
    const taken = await env.DB.prepare('SELECT 1 AS hit FROM "user" WHERE username = ?')
      .bind(candidate).first();
    if (!taken) return candidate;
  }
  return `halo${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const origin = url.origin;
  const fail = (code) => redirect(`${origin}/?auth_error=${encodeURIComponent(code)}`, [clearStateCookie()]);

  if (!env?.GOOGLE_CLIENT_ID || !env?.GOOGLE_CLIENT_SECRET) return fail("google_not_configured");
  if (!env.DB) return fail("google_database");
  if (url.searchParams.get("error")) return fail("google_cancelled");

  const state = url.searchParams.get("state") || "";
  const cookieState = parseCookies(request.headers.get("cookie"))[OAUTH_STATE_COOKIE] || "";
  if (!state || !cookieState || state !== cookieState) return fail("google_state");

  const code = url.searchParams.get("code") || "";
  if (!code) return fail("google_cancelled");

  const redirectUri = env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;

  let profile;
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenResponse.json().catch(() => ({}));
    if (!tokenResponse.ok || !tokenData.access_token) return fail("google_token");

    const userResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
      },
    });
    profile = await userResponse.json().catch(() => null);
    if (!userResponse.ok || !profile?.sub) return fail("google_profile");
  } catch (error) {
    console.error("Google OAuth exchange failed", error);
    return fail("google_failed");
  }

  const email = normalizeEmail(profile.email);
  const emailVerified = profile.email_verified === true || profile.email_verified === "true";
  if (!email || !emailVerified) return fail("google_email");

  const googleSub = String(profile.sub).slice(0, 255);
  const avatarUrl = String(profile.picture || "").slice(0, 1000) || null;
  const displayName = String(profile.name || "").trim().slice(0, 20) || null;

  try {
    let account = await env.DB.prepare(
      'SELECT username, google_sub FROM "user" WHERE google_sub = ?',
    ).bind(googleSub).first();

    if (!account) {
      account = await env.DB.prepare(
        'SELECT username, google_sub FROM "user" WHERE email = ?',
      ).bind(email).first();
      if (account?.google_sub && account.google_sub !== googleSub) return fail("google_conflict");
    }

    if (account) {
      await env.DB.prepare(`
        UPDATE "user" SET
          google_sub = ?,
          avatar_url = CASE WHEN avatar_url IS NULL OR avatar_url = '' THEN ? ELSE avatar_url END,
          display_name = CASE WHEN display_name IS NULL OR display_name = '' THEN ? ELSE display_name END
        WHERE username = ?
      `).bind(googleSub, avatarUrl, displayName || account.username, account.username).run();
    } else {
      const ipHash = await registrationIpHash(clientIp(request), env);
      const ipUsed = await env.DB.prepare("SELECT username FROM registration_ips WHERE ip_hash = ?")
        .bind(ipHash).first();
      if (ipUsed) return fail("google_ip_used");

      const username = await uniqueUsername(env, email);
      const salt = createPasswordSalt();
      const passwordHash = await hashPassword(crypto.randomUUID(), salt);
      const now = Date.now();

      let results;
      try {
        results = await env.DB.batch([
          env.DB.prepare(
            "INSERT INTO registration_ips (ip_hash, username, created_at) VALUES (?, ?, ?) ON CONFLICT(ip_hash) DO NOTHING",
          ).bind(ipHash, username, now),
          env.DB.prepare(`
            INSERT INTO "user" (username, email, display_name, avatar_url, google_sub, password_hash, password_salt, created_at, last_login_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
          `).bind(username, email, displayName || username, avatarUrl, googleSub, passwordHash, salt, now, now),
        ]);
      } catch (error) {
        console.error("Google account creation failed", error);
        return fail("google_failed");
      }

      if (!Number(results?.[0]?.meta?.changes || 0)) return fail("google_ip_used");
      account = { username };
    }

    const token = await createSession(env, account.username);
    return redirect(`${origin}/?auth=google`, [sessionCookie(token), clearStateCookie()]);
  } catch (error) {
    console.error("Google login failed", error);
    return fail("google_failed");
  }
}
