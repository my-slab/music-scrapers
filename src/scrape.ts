import * as publications from './publications'
import { List } from './types'
import { cleanAlbums, goto, launch, teardown } from './utils'

async function task(list: List) {
  console.log('Fetching::', list.URL)

  try {
    let browser = await launch()
    let page = await goto(browser, list.URL)
    let albums = await list.scrape(page)
    albums = cleanAlbums(albums)
    list.save(albums)
    await teardown(browser)
  } catch (e) {
    console.log(e)
  }
}

export async function scrape() {
  return Promise.all(
    [
      publications.pitchfork.bestNewAlbums,
      publications.stereogum.albumOfTheWeek,
      publications.stereogum.heavyRotation,
      publications.theNeedleDrop.lovedList,
    ].map(task)
  )
}
