#!/usr/bin/env node
import fs from "node:fs";

const version = String(process.argv[2] || "").trim();
if (!/^\d+\.\d+\.\d+$/.test(version)) {
  console.error("Usage: node scripts/bump-version.mjs <major.minor.patch>");
  process.exit(1);
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

const pkgPath = "package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.version = version;
writeJson(pkgPath, pkg);

const lockPath = "package-lock.json";
const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
lock.version = version;
if (lock.packages?.[""]) lock.packages[""].version = version;
writeJson(lockPath, lock);

const wranglerPath = "wrangler.toml";
const wrangler = fs.readFileSync(wranglerPath, "utf8");
fs.writeFileSync(
  wranglerPath,
  wrangler.replace(/(HALO_MUSIC_VERSION\s*=\s*")[^"]*(")/, `$1${version}$2`),
);

const gradlePath = "android/app/build.gradle";
const gradle = fs.readFileSync(gradlePath, "utf8");
fs.writeFileSync(
  gradlePath,
  gradle.replace(/haloVersionName\s*\?:\s*'[^']*'/, `haloVersionName ?: '${version}'`),
);
