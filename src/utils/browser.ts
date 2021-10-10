import puppeteer, { Browser, Page } from 'puppeteer'
import { backOff } from 'exponential-backoff'

/**
 * @name launch
 *
 * @description Create a browser instance.
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
 * @name goto
 *
 * @description Create a new page and navigate it
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
 * @name teardown
 *
 * @description Close the browser and pages.
 *
 * @see https://github.com/puppeteer/puppeteer/blob/v8.0.0/docs/api.md#browserclose
 *
 * @example
 * await teardown(browser)
 */
export async function teardown(browser: Browser): Promise<void> {
	return browser.close()
}

/**
 * @name waitFor
 *
 * @description Timeout for long page evalutations.
 *
 * @see https://github.com/puppeteer/puppeteer/blob/v8.0.0/docs/api.md#pagewaitforselectororfunctionortimeout-options-args
 *
 * @example
 * await waitFor(page, 5000, new Promise(() => {}))
 */
export async function waitFor<T>(page: Page, timeout = 5000, fn: Promise<T>): Promise<T | void> {
	return Promise.race([fn, page.waitFor(timeout)])
}
