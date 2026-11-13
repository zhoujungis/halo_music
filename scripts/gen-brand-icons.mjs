import { chromium } from 'file:///C:/Users/admin/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true
});
const page = await browser.newPage();
await page.setContent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512"><rect width="512" height="512" rx="38" fill="#C8EE62"/><path d="M138 128h64v98h108v-98h64v256h-64v-98H202v98h-64z" fill="#111111"/></svg>');
for (const item of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png'], [192, 'icon-192.png'], [512, 'icon-512.png']]) {
  const size = item[0];
  const svg = page.locator('svg');
  await svg.evaluate((node, value) => { node.setAttribute('width', value); node.setAttribute('height', value); }, size);
  await svg.screenshot({ path: 'D:/play/halo_music/' + item[1], scale: 'css' });
}
await browser.close();
