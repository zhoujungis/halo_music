#!/usr/bin/env node
// Provision a HALO Music account directly in D1.
//
// Normal registration happens in the UI (email verification code or Google).
// This script is for bootstrapping an admin account or a test user without
// going through the mail/OAuth flow. It derives the password with exactly the
// same scheme the Worker uses in functions/api/_auth.js — PBKDF2 / SHA-256,
// 100000 iterations, 16-byte salt, 32-byte key, lowercase hex — so a row
// created here can log in normally.
//
// Usage:
//   node scripts/create-account.mjs <username> <password>            # print SQL only
//   node scripts/create-account.mjs <username> <password> --local    # write to local D1
//   node scripts/create-account.mjs <username> <password> --remote   # write to production D1
//
// Examples:
//   node scripts/create-account.mjs demo halo2026 --local
//   node scripts/create-account.mjs zhoujun 'my secret' --remote

import { pbkdf2Sync, randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const PASSWORD_ITERATIONS = 100000;
const KEY_BYTES = 32;

const [username, password, ...flags] = process.argv.slice(2);

if (!username || !password) {
  console.error("用法: node scripts/create-account.mjs <username> <password> [--local|--remote]");
  process.exit(1);
}

const scope = flags.includes("--remote") ? "remote" : flags.includes("--local") ? "local" : "print";

const salt = randomBytes(16).toString("hex");
const hash = pbkdf2Sync(password, Buffer.from(salt, "hex"), PASSWORD_ITERATIONS, KEY_BYTES, "sha256").toString("hex");

// D1 has no prepared-statement access from the CLI, so inline the values.
// Usernames are ours to choose; escape anyway so a stray quote cannot break out.
const sqlUsername = username.replace(/'/g, "''");
const now = Date.now();

const sql = `INSERT INTO "user" (username, password_hash, password_salt, created_at, last_login_at)
VALUES ('${sqlUsername}', '${hash}', '${salt}', ${now}, NULL)
ON CONFLICT(username) DO UPDATE SET password_hash = excluded.password_hash, password_salt = excluded.password_salt;`;

if (scope === "print") {
  console.log(sql);
  process.exit(0);
}

// Prefer the locally installed wrangler so this works without a global install.
const localWrangler = path.resolve(
  "node_modules",
  ".bin",
  process.platform === "win32" ? "wrangler.cmd" : "wrangler",
);
const wrangler = existsSync(localWrangler) ? localWrangler : "wrangler";

// Pass the statement through a file: shell quoting mangles inline SQL that
// contains spaces, quotes and newlines.
const tmpDir = path.resolve(".wrangler", "tmp");
mkdirSync(tmpDir, { recursive: true });
const sqlFile = path.join(tmpDir, `create-account-${Date.now()}.sql`);
writeFileSync(sqlFile, sql + "\n", "utf8");

const result = spawnSync(
  wrangler,
  ["d1", "execute", "halo-music-db", `--${scope}`, `--file=${sqlFile}`],
  { stdio: "inherit", shell: process.platform === "win32" },
);

rmSync(sqlFile, { force: true });

if (result.status !== 0) {
  console.error("\n写入失败。请确认 wrangler.toml 中的 d1_databases 绑定名为 halo-music-db。");
  process.exit(result.status ?? 1);
}

console.log(`\n✅ 账号已写入 ${scope} 数据库`);
console.log(`   用户名: ${username}`);
console.log(`   密码:   ${password}`);
