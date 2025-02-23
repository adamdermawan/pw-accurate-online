import { test, expect, BrowserContext, Page } from '@playwright/test';

test('Open AOL', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('http://account.accurate.test1');
  await expect(page).toHaveTitle(/Accurate Online: Pembukuan lengkap, mudah, dan murah untuk perusahaan Anda/);
});



