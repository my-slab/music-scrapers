import { Albums, List } from '../../types'
import { Page } from 'puppeteer'
import { save } from '../../utils'

export const lovedList: List = {
	URL: 'https://www.theneedledrop.com/loved-list',
	name: 'Loved List',
	save: save('./data/the-needle-drop/loved-list.json'),
	scrape,
}

async function scrape(page: Page): Promise<Albums> {
	return page.evaluate(() => {
		const SELECTOR = '.article-card__title a'

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
