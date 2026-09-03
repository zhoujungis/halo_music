const $ = (id) => document.getElementById(id);
const loginView = $("login-view");
const dashboardView = $("dashboard-view");
const loginMessage = $("login-message");
const dashboardMessage = $("dashboard-message");

function setMessage(element, message) {
  element.textContent = message || "";
  element.hidden = !message;
}

function formatDate(value) {
  const date = new Date(Number(value));
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date).replace(/\//g, "-");
}

function renderDashboard(data) {
  $("admin-identity").textContent = `管理员：${data.admin}`;
  $("logout-button").hidden = false;
  $("stats").innerHTML = Object.entries({
    用户: data.stats.users,
    活跃会话: data.stats.activeSessions,
    收藏与歌单: data.stats.libraries,
    音频缓存: data.stats.musicCache,
    搜索缓存: data.stats.searchCache,
  }).map(([label, value]) => `<div class="stat"><span class="stat-label">${label}</span><strong class="stat-value">${value}</strong></div>`).join("");
  $("users").innerHTML = data.recentUsers.map((user) => `<tr><td>${escapeHtml(user.username)}</td><td>${formatDate(user.created_at)}</td><td>${formatDate(user.last_login_at)}</td></tr>`).join("") || `<tr><td colspan="3">暂无账号</td></tr>`;
  loginView.hidden = true;
  dashboardView.hidden = false;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

async function loadDashboard() {
  setMessage(dashboardMessage, "");
  const response = await fetch("/api/admin", { credentials: "same-origin" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "管理数据读取失败");
  renderDashboard(data);
}

$("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const button = event.target.querySelector("button[type=submit]");
  button.disabled = true;
  setMessage(loginMessage, "");
  try {
    const response = await fetch("/api/login", {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: $("username").value.trim(), password: $("password").value }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "登录失败");
    await loadDashboard();
  } catch (error) {
    setMessage(loginMessage, error.message);
  } finally {
    button.disabled = false;
  }
});

$("refresh-button").addEventListener("click", () => loadDashboard().catch((error) => setMessage(dashboardMessage, error.message)));
$("logout-button").addEventListener("click", async () => {
  await fetch("/api/logout", { method: "POST", credentials: "same-origin" }).catch(() => {});
  window.location.reload();
});

loadDashboard().catch((error) => {
  if (!/先登录|无权访问/.test(error.message)) setMessage(loginMessage, error.message);
});
