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
  let p: keyof typeof publications
  for (p in publications) {
    let publication = publications[p]
    for (let l in publication) {
      let list = (<any>publication)[l]
      await task(list)
    }
  }
}
