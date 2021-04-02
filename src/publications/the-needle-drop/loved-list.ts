import unescape from 'lodash/unescape'
import { Album, PublicationQuery } from '../../types'
import { Page } from 'puppeteer'
import { save } from '../index'

const PATH = './data/raw/the-needle-drop/loved-list.json'
const URL = 'https://www.theneedledrop.com/loved-list'

async function scrape(page: Page): Promise<Album[]> {
  return page.evaluate((e) => {
    const SELECTOR = 'p:first-child strong + a'

    let albums: Album[] = []
    for (let { innerHTML } of document.querySelectorAll(SELECTOR)) {
      let [artist, title] = innerHTML.split('-')

      albums.push({
        artist: unescape(artist),
        title: unescape(title),
      })
    }

    return albums
  })
}

export const lovedList: PublicationQuery = {
  URL,
  save: save(PATH),
  scrape,
}
