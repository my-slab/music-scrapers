import puppeteer, { Browser, Page } from 'puppeteer';

/**
 * @example
 * let browser = await launch()
 */
export async function launch(): Promise<Browser> {
  return puppeteer.launch();
}

/**
 *
 * @param browser
 * @param url
 *
 * @example
 * let page = await goto(browser, url)
 */
export async function goto(browser: Browser, url: string): Promise<Page> {
  let page = await browser.newPage();
  await page.goto(url);
  return page;
}

/**
 *
 * @param browser
 * @example
 * await teardown(browser)
 */
export async function teardown(browser: Browser) {
  browser.close();
}
