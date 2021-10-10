import * as publications from './publications'
import { List } from './types'
import { cleanAlbums, goto, launch, teardown } from './utils'

async function scrape(list: List) {
	console.log('🕷 Fetching::', list.URL)
	let browser = await launch()

	try {
		let page = await goto(browser, list.URL)
		let albums = await list.scrape(page)
		albums = cleanAlbums(albums)
		list.save(albums)
		console.log('✅ Done::', list.URL)
	} catch (error) {
		console.log('🚨 Error:: ${list.URL}', list.URL)
		console.log((error as Error)?.message)
	} finally {
		await teardown(browser)
	}
}

(async () => {
	await Promise.all(
		[
			publications.bleep.albumOfTheWeek,
			publications.pitchfork.bestNewAlbums,
			publications.pitchfork.highScoringAlbums,
			publications.stereogum.albumOfTheWeek,
			publications.stereogum.heavyRotation,
			publications.theNeedleDrop.lovedList,
		].map(scrape)
	)
})()
