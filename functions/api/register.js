import {
  createPasswordSalt,
  createSession,
  hashPassword,
  isValidEmail,
  isValidUsername,
  json,
  normalizeEmail,
  sessionCookie,
} from "./_auth.js";
import { verificationCodeHash } from "./_email.js";

const MAX_CODE_ATTEMPTS = 5;

function duplicateResponse(message) {
  return json({ error: message }, 409);
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: "数据库未绑定（D1 binding 缺失）" }, 500);

  let body;
  try { body = await request.json(); }
  catch { return json({ error: "请求格式错误" }, 400); }

  const email = normalizeEmail(body.email);
  const code = String(body.code || "").trim();
  const username = String(body.username || "").trim();
  const password = String(body.password || "");

  if (!isValidEmail(email)) return json({ error: "请输入有效的邮箱地址" }, 400);
  if (!/^\d{6}$/.test(code)) return json({ error: "请输入 6 位邮箱验证码" }, 400);
  if (!isValidUsername(username)) return json({ error: "用户名需为 3–20 位字母、数字、下划线或中文" }, 400);
  if (password.length < 8 || password.length > 128) return json({ error: "密码长度需为 8–128 位" }, 400);

  const now = Date.now();
  try {
    const record = await env.DB.prepare(
      "SELECT code_hash, expires_at, attempts FROM email_verification_codes WHERE email = ? AND purpose = 'register'",
    ).bind(email).first();
    if (!record) return json({ error: "请先获取邮箱验证码" }, 400);
    if (Number(record.expires_at) <= now) {
      await env.DB.prepare("DELETE FROM email_verification_codes WHERE email = ? AND purpose = 'register'")
        .bind(email).run().catch(() => {});
      return json({ error: "验证码已过期，请重新获取" }, 400);
    }
    if (Number(record.attempts) >= MAX_CODE_ATTEMPTS) {
      return json({ error: "验证码尝试次数过多，请重新获取" }, 429);
    }

    const expected = await verificationCodeHash(email, code);
    if (expected !== record.code_hash) {
      await env.DB.prepare(
        "UPDATE email_verification_codes SET attempts = attempts + 1 WHERE email = ? AND purpose = 'register'",
      ).bind(email).run().catch(() => {});
      return json({ error: "验证码不正确" }, 401);
    }

    const emailTaken = await env.DB.prepare('SELECT username FROM "user" WHERE email = ?')
      .bind(email).first();
    if (emailTaken) return duplicateResponse("该邮箱已注册，请直接登录");

    const usernameTaken = await env.DB.prepare('SELECT username FROM "user" WHERE username = ?')
      .bind(username).first();
    if (usernameTaken) return duplicateResponse("该用户名已被使用");

    const salt = createPasswordSalt();
    const passwordHash = await hashPassword(password, salt);

    try {
      await env.DB.batch([
        env.DB.prepare(`
          INSERT INTO "user" (username, email, display_name, avatar_url, password_hash, password_salt, created_at, last_login_at)
          VALUES (?, ?, ?, NULL, ?, ?, ?, ?)
        `).bind(username, email, username, passwordHash, salt, now, now),
        env.DB.prepare("DELETE FROM email_verification_codes WHERE email = ? AND purpose = 'register'")
          .bind(email),
      ]);
    } catch (error) {
      console.error("Registration insert failed", error);
      const message = String(error?.message || "");
      if (/UNIQUE constraint failed: user\.email/i.test(message)) return duplicateResponse("该邮箱已注册，请直接登录");
      if (/UNIQUE constraint failed: user\.username/i.test(message)) return duplicateResponse("该用户名已被使用");
      return json({ error: "注册失败，请稍后重试" }, 503);
    }

    let token;
    try {
      token = await createSession(env, username);
    } catch (error) {
      console.error("Registration session failed", error);
      return json({ error: "账号已创建，请直接登录" }, 500);
    }

    return json(
      { ok: true, username },
      200,
      { "Set-Cookie": sessionCookie(token) },
    );
  } catch (error) {
    console.error("Registration failed", error);
    return json({ error: "注册服务未初始化，请先执行数据库迁移" }, 503);
  }
}
