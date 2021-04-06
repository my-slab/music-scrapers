import { Album, List } from '../../types'
import { Page } from 'puppeteer'
import { save } from '../../utils'

const PATH = './data/raw/stereogum/heavy-rotation.json'
const URL = 'https://www.stereogum.com/heavy-rotation'

async function scrape(page: Page): Promise<Album[]> {
  return page.evaluate(() => {
    const SELECTOR = '.article-card__title a'

    let albums: Album[] = []
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

export const heavyRotation: List = {
  URL,
  save: save(PATH),
  scrape,
}
