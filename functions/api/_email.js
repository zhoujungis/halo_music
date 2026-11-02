import { sha256Hex } from "./_auth.js";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const DEFAULT_RESEND_FROM = "no-reply@music.zhoujun.dev";

export function isEmailConfigured(env) {
  return Boolean(String(env?.RESEND_API_KEY || "").trim());
}

export function verificationCodeHash(email, code) {
  return sha256Hex(`${email}:${code}`);
}

export function randomVerificationCode() {
  const values = crypto.getRandomValues(new Uint32Array(1));
  return String(values[0] % 1000000).padStart(6, "0");
}

function verificationEmailHtml(code) {
  return `<!doctype html>
<html lang="zh">
  <body style="margin:0;padding:0;background:#f7f7f2;color:#1f2a24;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Noto Sans SC',sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background:#ffffff;border:1px solid #dce2da;border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:26px 30px 0;">
                <div style="font-size:11px;font-weight:700;letter-spacing:.18em;color:#657168;">HALO MUSIC · ACCOUNT</div>
                <h1 style="margin:12px 0 0;font-size:24px;letter-spacing:-.03em;">验证你的邮箱</h1>
                <p style="margin:10px 0 0;font-size:14px;line-height:1.7;color:#56645a;">把下面的验证码填回注册页面，即可完成 HALO Music 账号创建。</p>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 30px;">
                <div style="padding:20px;border-radius:14px;background:#ecefe8;border:1px solid #dce2da;text-align:center;font-size:34px;font-weight:700;letter-spacing:.34em;color:#3f6b57;font-family:Menlo,Consolas,monospace;">${code}</div>
                <p style="margin:18px 0 0;font-size:12px;line-height:1.7;color:#657168;">验证码 10 分钟内有效，最多尝试 5 次。如果不是你本人操作，请忽略这封邮件。</p>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 30px;background:#ecefe8;border-top:1px solid #dce2da;font-size:11px;line-height:1.6;color:#657168;">
                HALO Music · 多音源搜索、在线播放与歌单管理
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function resendFrom(env) {
  const raw = String(env?.RESEND_FROM || DEFAULT_RESEND_FROM).trim() || DEFAULT_RESEND_FROM;
  if (raw.includes("<")) return raw;
  const senderName = String(env?.RESEND_SENDER_NAME || "HALO Music").trim() || "HALO Music";
  return `${senderName} <${raw}>`;
}

export async function sendVerificationEmail(env, email, code) {
  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendFrom(env),
      to: [email],
      subject: `HALO Music 验证码：${code}`,
      html: verificationEmailHtml(code),
      text: `HALO Music 验证码：${code}\n\n验证码 10 分钟内有效，最多尝试 5 次。\n如果不是你本人操作，请忽略这封邮件。`,
    }),
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    const reason = detail?.message || `Resend request failed (${response.status})`;
    const error = new Error(reason);
    error.status = response.status;
    throw error;
  }
  return response.json().catch(() => ({}));
}
