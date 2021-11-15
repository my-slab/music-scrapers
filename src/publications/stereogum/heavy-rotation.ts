import { Page } from 'puppeteer'

import { Albums, List } from '../../types'
import { save } from '../../utils'

export const heavyRotation: List = {
	URL: 'https://www.stereogum.com/heavy-rotation',
	name: 'Heavy Rotation',
	save: save('./data/stereogum/heavy-rotation.csv'),
	scrape,
}

async function scrape(page: Page): Promise<Albums> {
	return page.evaluate(() => {
		const SELECTOR = '.article-card__title a'

		let albums: Albums = []
		for (let element of document.querySelectorAll(SELECTOR)) {
			let [artist, title] = (element as HTMLElement).innerText.split('-')

			if (!title) continue

			albums.push({
				artist: artist,
				title: title,
			})
		}

		return albums
	})
}
