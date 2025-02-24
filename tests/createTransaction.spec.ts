import { test, expect, BrowserContext, Page } from '@playwright/test';

/**
 * for a while I use xpath locator, in the future it will be used by seperate functions
 * so ignore first if the test feels so flaky
 */

const URL = "https://account.accurate.test1";

test.beforeEach(async ({page}) => {
  test.setTimeout(120_000);
  await page.goto(URL);
})

test('Login AOL', async ({ page, context }) => {
  //Login to Accurate Online
  await page.locator("//form[@id='login-form']//input[@id='account']").fill("anisalt@bisnis2030.com");
  await page.locator("//form[@id='login-form']//input[@id='password']").fill("123456");
  await page.getByRole('button', { name: 'Masuk' }).click();

  //Login Success
  await expect(page).toHaveTitle(/Data Usaha /);

  //Open the existing Database, Switch to new tab
  const [newTab]= await Promise.all([
      page.waitForEvent('popup'),
      page.locator("//h3[.='Airn skincare']").click(),
  ]);

  //Open sales module
  await newTab.locator(
      "//nav[@class='vertical-menu']//div[contains(@class,'sub-menu')]//span[text()='Faktur Penjualan']/ancestor::div[contains(@class, 'sub-menu')]/preceding-sibling::a[contains(@class, 'bg-hover-red-aol')]"
  ).click();
  await newTab.locator(
      "//span[text()='Faktur Penjualan']/ancestor::li[contains(@class, 'no-margin')]//h3[contains(@class, 'fg-gray')]"
  ).click();
  await newTab.locator(
      "//nav[@class='vertical-menu']//div[contains(@class,'sub-menu')]//span[text()='Faktur Penjualan']"
  ).click();

  //create sales invoice
  /**
   * I know the code is ugly as fuck, I will improve it in the next commit maybe
   * but it works for now tho..
   */

  /* Fill Customer */
  await newTab.getByPlaceholder('Cari/Pilih Pelanggan...').fill('CV Garda');
  await newTab.locator(
      "//div[@class='form-content']//form[@class='form']/div[@class='grid fluid no-margin']//button[@class='btn-search']"
      ).click();
  await newTab.locator("//div[div[input[@name='customer']]]/ul[@class='lookup-search-result']/li[1]").click();

  /* Fill Item */
  await newTab.getByPlaceholder('Cari/Pilih Barang & Jasa...').fill('air mineral');
  await newTab.locator(
      "//div[@class='trans-detail-tab frame-left-tab frames']/div[@class='frame active']//div[@class='span4']//button[@class='btn-search']"
  ).click();
  await newTab.locator("//div[div[input[@name='searchDetailItem']]]/ul[@class='lookup-search-result']/li[1]").click();
  await newTab.getByRole('button', { name: 'Lanjut' }).click();
  //click save file
  await newTab.locator("//*[@id='module-accurate__customer__sales-invoice']//*[@id='btnSave']").click();

  //click continue notifications
  await newTab.locator("//div[contains(@class,'queue-indicator')]").click();
  await newTab.locator("//div[@class='queue-content']//button[text()='Lanjutkan']").click();
});

