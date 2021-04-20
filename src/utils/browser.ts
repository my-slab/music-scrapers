import puppeteer, { Browser, Page } from 'puppeteer'
import { backOff } from 'exponential-backoff'

/**
 * launch
 *
 * Create a browser instance.
 *
 * @see https://github.com/puppeteer/puppeteer/blob/v8.0.0/docs/api.md#puppeteerlaunchoptions
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
 * @see https://github.com/puppeteer/puppeteer/blob/v8.0.0/docs/api.md#pagegotourl-options
 *
 * @example
 * let page = await goto(browser, url)
 */
export async function goto(browser: Browser, url: string): Promise<Page> {
  let page = await browser.newPage()
  await backOff(() => page.goto(url))
  return page
}

/**
 * teardown
 *
 * Close the browser and pages.
 *
 * @see https://github.com/puppeteer/puppeteer/blob/v8.0.0/docs/api.md#browserclose
 *
 * @example
 * await teardown(browser)
 */
export async function teardown(browser: Browser): Promise<void> {
  return browser.close()
}
