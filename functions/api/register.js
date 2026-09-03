import { json } from "./_auth.js";

// Public registration is intentionally disabled. Accounts must be provisioned
// by an administrator directly in D1 until an invite flow is introduced.
export async function onRequestPost() {
  return json({ error: "注册入口已关闭，请联系管理员开通账号" }, 410);
}
