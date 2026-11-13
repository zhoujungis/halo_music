import { chromium } from 'file:///C:/Users/admin/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true
});
const page = await browser.newPage({ viewport: { width: 1440, height: 960 }, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:8788', { waitUntil: 'networkidle' });
await page.addStyleTag({ content: 'body.auth-gated .app{visibility:visible!important;pointer-events:auto!important}.login-modal{display:none!important}' });
console.log('desktop panels', await page.locator('.layout > .panel').evaluateAll(items => items.map(item => ({ className: item.className, box: item.getBoundingClientRect().toJSON(), display: getComputedStyle(item).display }))));
await page.screenshot({ path: 'C:/Users/admin/AppData/Local/Temp/halo-desktop-preview.png', fullPage: false });
await page.locator('.desktop-nav [data-desktop-view="search"]').click();
await page.waitForTimeout(150);
await page.screenshot({ path: 'C:/Users/admin/AppData/Local/Temp/halo-desktop-search.png', fullPage: false });
await page.locator('.desktop-nav [data-desktop-view="queue"]').click();
await page.waitForTimeout(150);
await page.screenshot({ path: 'C:/Users/admin/AppData/Local/Temp/halo-desktop-queue.png', fullPage: false });
await page.locator('.desktop-nav [data-desktop-view="me"]').click();
await page.waitForTimeout(150);
await page.screenshot({ path: 'C:/Users/admin/AppData/Local/Temp/halo-desktop-me.png', fullPage: false });
await page.locator('.desktop-nav [data-desktop-view="lyrics"]').click();
await page.waitForTimeout(100);
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
await page.screenshot({ path: 'C:/Users/admin/AppData/Local/Temp/halo-mobile-search.png', fullPage: false });
await page.locator('[data-mobile-view="lyrics"]').click();
await page.waitForTimeout(150);
console.log('mobile player', await page.locator('.player-panel').evaluate(el => ({ box: el.getBoundingClientRect().toJSON(), cover: getComputedStyle(el.querySelector('.cover-wrapper')).display, track: getComputedStyle(el.querySelector('.track-title-row')).display, controls: getComputedStyle(el.querySelector('.player-controls')).display, lyrics: getComputedStyle(el.querySelector('.lyrics-container')).display })));
await page.screenshot({ path: 'C:/Users/admin/AppData/Local/Temp/halo-mobile-player.png', fullPage: false });
await page.locator('[data-mobile-view="queue"]').click();
await page.waitForTimeout(150);
console.log('mobile queue', await page.locator('.playlist-panel').evaluate(el => ({ box: el.getBoundingClientRect().toJSON(), display: getComputedStyle(el).display })));
await page.screenshot({ path: 'C:/Users/admin/AppData/Local/Temp/halo-mobile-queue.png', fullPage: false });
await page.locator('[data-mobile-view="me"]').click();
await page.waitForTimeout(150);
await page.screenshot({ path: 'C:/Users/admin/AppData/Local/Temp/halo-mobile-me.png', fullPage: false });
await page.evaluate(() => document.querySelector('#announcement-modal').classList.add('show'));
await page.waitForTimeout(100);
await page.screenshot({ path: 'C:/Users/admin/AppData/Local/Temp/halo-announcement.png', fullPage: false });
console.log('desktop', await page.locator('.layout').boundingBox());
console.log('player', await page.locator('.player-panel').boundingBox());
console.log('queue', await page.locator('.playlist-panel').boundingBox());
await browser.close();
