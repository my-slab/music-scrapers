import { Albums, List } from '../../types'
import { Page } from 'puppeteer'
import { save } from '../../utils'

export const albumOfTheWeek: List = {
	URL: 'https://www.stereogum.com/category/reviews/album-of-the-week/',
	name: 'Album Of The Week',
	save: save('./data/stereogum/album-of-the-week.json'),
	scrape,
}

async function scrape(page: Page): Promise<Albums> {
	return page.evaluate(() => {
		const SELECTOR = '.article-card__title a'

		let albums: Albums = []
		for (let { childNodes } of document.querySelectorAll(SELECTOR)) {
			let [artist, title] = [childNodes[0] as ChildNode, childNodes[1] as HTMLElement]

			albums.push({
				artist: (artist.textContent || '').split('Album Of The Week:')[1],
				title: title.innerText,
			})
		}

		return albums
	})
}
