const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const out = path.join(process.cwd(), 'artifacts', 'visual-smoke');
fs.mkdirSync(out, { recursive: true });
const routes = ['/', '/pl/', '/rap-ort/', '/rap-ort/prawda-sumienia/', '/rap-ort/witness-report/', '/rap-ort/raport-swiadka/', '/sztab/', '/sztab/origins/', '/music/', '/music/pl/', '/between-the-lines/', '/miedzy-wierszami/', '/for-institutions/', '/press-recognition/', '/contact/'];
(async () => {
  const browser = await chromium.launch({ headless: true });
  const results = [];
  for (const viewport of [{name:'desktop', width:1366, height:900}, {name:'mobile', width:390, height:844}]) {
    const page = await browser.newPage({ viewport });
    const consoleErrors = [];
    const badResponses = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('response', res => { if (res.status() >= 400 && res.url().startsWith('http://127.0.0.1:4173')) badResponses.push(`${res.status()} ${res.url()}`); });
    for (const route of routes) {
      await page.goto(`http://127.0.0.1:4173${route}`, { waitUntil: 'networkidle' });
      const info = await page.evaluate(() => {
        const header = document.querySelector('.site-header');
        const h1 = document.querySelector('h1')?.textContent.trim();
        const navLinks = [...document.querySelectorAll('.desktop-nav-compact a, .mobile-menu-nav a')].map(a => a.textContent.trim()).filter(Boolean);
        const bodyClasses = document.body.className;
        const overflow = document.documentElement.scrollWidth - window.innerWidth;
        const visibleHeader = !!header && getComputedStyle(header).display !== 'none';
        const hero = document.querySelector('.vh-hero');
        const heroRect = hero?.getBoundingClientRect();
        return { title: document.title, h1, navLinks, bodyClasses, overflow, visibleHeader, heroHeight: heroRect?.height || 0 };
      });
      if (viewport.name === 'desktop' && ['/', '/pl/', '/rap-ort/', '/sztab/', '/contact/'].includes(route)) {
        await page.screenshot({ path: path.join(out, `${viewport.name}-${route.replaceAll('/','_') || 'home'}.png`), fullPage: false });
      }
      if (viewport.name === 'mobile' && ['/', '/pl/', '/contact/'].includes(route)) {
        await page.screenshot({ path: path.join(out, `${viewport.name}-${route.replaceAll('/','_') || 'home'}.png`), fullPage: false });
      }
      results.push({ viewport: viewport.name, route, ...info });
    }
    await page.close();
    if (consoleErrors.length || badResponses.length) results.push({ viewport: viewport.name, route: 'diagnostics', consoleErrors, badResponses });
  }
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.click('#cinematicToggle');
  const cinematic = await page.evaluate(() => ({ body: document.body.classList.contains('cinematic-mode'), storage: localStorage.getItem('siteCinematicMode') }));
  await page.click('[data-reduce-motion-toggle]');
  const reduced = await page.evaluate(() => ({ body: document.body.classList.contains('reduce-motion') || document.body.classList.contains('reduced-motion'), storage: localStorage.getItem('siteReducedMotion') }));
  await page.goto('http://127.0.0.1:4173/rap-ort/witness-report/', { waitUntil: 'networkidle' });
  await page.fill('[name="firstName"]', 'Anna');
  await page.fill('[name="lastName"]', 'Kowalska');
  const witness = await page.textContent('[data-witness-name]');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' });
  await page.click('#mobileMenuToggle');
  const mobileMenu = await page.evaluate(() => ({ open: document.body.classList.contains('mobile-menu-open'), expanded: document.getElementById('mobileMenuToggle')?.getAttribute('aria-expanded') }));
  await browser.close();
  const failures = results.filter(r => r.overflow > 2 || !r.visibleHeader || !r.h1 || r.heroHeight < 250 || (r.badResponses && r.badResponses.length) || (r.consoleErrors && r.consoleErrors.length));
  const summary = { checked: results.length, failures, cinematic, reduced, witness, mobileMenu, screenshots: out };
  console.log(JSON.stringify(summary, null, 2));
  if (failures.length || !cinematic.body || !reduced.body || witness.trim() !== 'Anna Kowalska' || !mobileMenu.open) process.exit(1);
})();
