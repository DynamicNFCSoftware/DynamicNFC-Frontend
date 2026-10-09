import { test, expect } from '@playwright/test';

// What this catches: a page that crashes, a page wider than the phone screen,
// a wrong language/direction, English left behind in a translated page, raw translation keys on screen.
const LANGS = ['en', 'it', 'fr', 'es', 'ar'];
const WIDTHS = [375, 1440];
const ROUTES = ['/', '/enterprise', '/developers', '/automotive', '/nfc-cards', '/contact-sales', '/pricing', '/login', '/privacy', '/terms'];
const ENGLISH_LEFTOVERS = ['All Rights Reserved', 'This is what your sales team sees', 'Last updated'];
const RAW_KEY = /\b[a-z]+\d*(Title|Desc|Label|Cta|Sub)(_[a-z]+)?\b/;

const useLang = (page, lang) =>
  page.addInitScript((l) => {
    localStorage.setItem('dnfc_lang', l);
    localStorage.setItem('dnfc_cookie_consent', 'declined');
  }, lang);

for (const lang of LANGS) {
  for (const width of WIDTHS) {
    test(`public pages · ${lang} · ${width}px`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await useLang(page, lang);
      await page.setViewportSize({ width, height: 900 });

      for (const route of ROUTES) {
        await page.goto(route);
        await page.locator('h1').first().waitFor();

        await expect(page.locator('html'), route).toHaveAttribute('lang', lang);
        await expect(page.locator('html'), route).toHaveAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        // Polled: entry animations make the page wider for a few frames; only a width that stays wrong is a bug.
        await expect
          .poll(() => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), {
            message: `${route}: page is wider than the screen`,
          })
          .toBeLessThanOrEqual(1);

        const text = await page.locator('body').innerText();
        expect(text, `${route}: raw translation key on screen`).not.toMatch(RAW_KEY);
        if (lang !== 'en') for (const s of ENGLISH_LEFTOVERS) expect(text, `${route}: English left in ${lang}`).not.toContain(s);
      }
      expect(errors, 'JavaScript errors').toEqual([]);
    });
  }
}

test('language choice survives a reload', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  await page.locator('.nav-lang-select').selectOption('it');
  await expect(page.locator('html')).toHaveAttribute('lang', 'it');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'it');
});

test('mobile menu opens and closes', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const menu = page.locator('.nav-menu');
  await expect(menu).toBeHidden();
  await page.locator('.nav-hamburger').click();
  await expect(menu).toBeVisible();
  await page.locator('.nav-hamburger').click();
  await expect(menu).toBeHidden();
});
