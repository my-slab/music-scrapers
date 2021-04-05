import puppeteer, { Browser, Page } from 'puppeteer'

/**
 * launch
 *
 * Create a browser instance.
 *
 * @example
 * let browser = await launch()
 */
export async function launch(): Promise<Browser> {
  return puppeteer.launch()
}

/**
 * goto
 *
 * Create a new page and navigate it
 *
 * @param browser Browser
 * @param url string
 *
 * @example
 * let page = await goto(browser, url)
 */
export async function goto(browser: Browser, url: string): Promise<Page> {
  let page = await browser.newPage()
  await page.goto(url)
  return page
}

/**
 * teardown
 *
 * Close the browser and pages.
 *
 * @param browser Browser
 *
 * @example
 * await teardown(browser)
 */
export async function teardown(browser: Browser) {
  browser.close()
}
