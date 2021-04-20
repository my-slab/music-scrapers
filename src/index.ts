import * as publications from './publications'
import { List } from './types'
import { cleanAlbums, goto, launch, teardown } from './utils'

async function scrape(list: List) {
  console.log('🕷 Fetching::', list.URL)

  try {
    let browser = await launch()
    let page = await goto(browser, list.URL)
    let albums = await list.scrape(page)
    albums = cleanAlbums(albums)
    list.save(albums)
    await teardown(browser)
    console.log('✅ Done::', list.URL)
  } catch (e) {
    console.log(e)
  }
}

;(async () => {
  await Promise.all(
    [
      publications.pitchfork.bestNewAlbums,
      publications.stereogum.albumOfTheWeek,
      publications.stereogum.heavyRotation,
      publications.theNeedleDrop.lovedList,
    ].map(scrape)
  )
})()
