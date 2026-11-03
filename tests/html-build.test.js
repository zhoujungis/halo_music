import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderHtml } from "../scripts/build-html.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const pkg = JSON.parse(read("package.json"));

test("index.html matches a fresh build from src/partials", () => {
  const built = renderHtml(path.join(root, "src", "partials"), pkg.version);
  assert.equal(
    read("index.html"),
    built,
    "index.html is stale or hand-edited; run `npm run build:html`",
  );
});

test("index.html carries the PWA and iOS meta tags", () => {
  const html = read("index.html");
  assert.match(html, /<link rel="manifest" href="manifest\.json" \/>/);
  assert.match(html, /<meta name="apple-mobile-web-app-capable" content="yes" \/>/);
  assert.match(html, /<meta name="mobile-web-app-capable" content="yes" \/>/);
  assert.match(html, /<link rel="apple-touch-icon"[^>]*apple-touch-icon\.png/);
  assert.ok(
    !html.includes("{{"),
    "generated HTML still contains an unreplaced placeholder",
  );
});

test("manifest.json is installable and its icons exist", () => {
  const manifest = JSON.parse(read("manifest.json"));
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "/");
  assert.equal(manifest.scope, "/");
  assert.ok(manifest.name && manifest.short_name);
  assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0);
  for (const icon of manifest.icons) {
    assert.ok(fs.existsSync(path.join(root, icon.src)), `missing icon: ${icon.src}`);
    assert.match(icon.type, /^image\//);
  }
});

test("client download modal exposes both the generic list and the iOS guide", () => {
  const html = read("index.html");
  assert.match(html, /id="client-download-generic"/);
  assert.match(html, /id="ios-install-guide"[^>]*hidden/);
  assert.match(html, /id="ios-not-safari-tip"/);
  assert.match(html, /id="ios-already-installed"/);
});
