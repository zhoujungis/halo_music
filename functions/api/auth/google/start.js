const OAUTH_STATE_COOKIE = "hm_oauth_state";
const OAUTH_STATE_TTL_SECONDS = 10 * 60;

function redirect(location, cookies = []) {
  const headers = new Headers({
    Location: location,
    "Cache-Control": "no-store",
  });
  for (const cookie of cookies) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 302, headers });
}

function stateCookie(value) {
  return `${OAUTH_STATE_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${OAUTH_STATE_TTL_SECONDS}`;
}

export async function onRequestGet({ request, env }) {
  const origin = new URL(request.url).origin;
  if (!env?.GOOGLE_CLIENT_ID || !env?.GOOGLE_CLIENT_SECRET) {
    return redirect(`${origin}/?auth_error=google_not_configured`);
  }

  const redirectUri = env.GOOGLE_REDIRECT_URI || `${origin}/api/auth/google/callback`;
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
    access_type: "online",
  });

  return redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, [stateCookie(state)]);
}
