import { Album, List } from '../../types'
import { Page } from 'puppeteer'
import { save } from '../index'

const PATH = './data/raw/the-needle-drop/loved-list.json'
const URL = 'https://www.theneedledrop.com/loved-list'

async function scrape(page: Page): Promise<Album[]> {
  return page.evaluate(() => {
    const SELECTOR = 'p:first-child strong + a'

    let albums: Album[] = []
    for (let { innerHTML } of document.querySelectorAll(SELECTOR)) {
      let [artist, title] = innerHTML.split('-')
      albums.push({
        artist: artist,
        title: title,
      })
    }

    return albums
  })
}

export const lovedList: List = {
  URL,
  save: save(PATH),
  scrape,
}
