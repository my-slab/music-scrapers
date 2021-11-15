import { Page } from 'puppeteer'

import { Albums, List } from '../../types'
import { save } from '../../utils'

export const lovedList: List = {
	URL: 'https://www.theneedledrop.com/loved-list',
	name: 'Loved List',
	save: save('./data/the-needle-drop/loved-list.csv'),
	scrape,
}

async function scrape(page: Page): Promise<Albums> {
	return page.evaluate(() => {
		const SELECTOR = 'div p:first-child a'

		let albums: Albums = []
		for (let element of document.querySelectorAll(SELECTOR)) {
			let [artist, title] = (element as HTMLElement).innerText.split('-')
			albums.push({
				artist: artist,
				title: title,
			})
		}

		return albums
	})
}
