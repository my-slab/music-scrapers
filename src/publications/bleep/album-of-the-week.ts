import { Albums, List } from '../../types'
import { Page } from 'puppeteer'
import { save } from '../../utils'

export const albumOfTheWeek: List = {
	URL: 'https://bleep.com/stream/album-of-the-week',
	name: 'Album Of The Week',
	save: save('./data/bleep/album-of-the-week.json'),
	scrape,
}

async function scrape(page: Page): Promise<Albums> {
	return page.evaluate(() => {
		const SELECTOR = '.product-info.music dl'

		let albums: Albums = []
		for (let { children } of document.querySelectorAll(SELECTOR)) {
			let [artist, title] = [children[1] as HTMLElement, children[3] as HTMLElement]

			albums.push({
				artist: artist.innerText,
				title: title.innerText,
			})
		}

		return albums
	})
}
