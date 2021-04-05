import { Album, List } from '../../types'
import { Page } from 'puppeteer'
import { save } from '../index'

const PATH = './data/raw/stereogum/album-of-the-week.json'
const URL = 'https://www.stereogum.com/category/reviews/album-of-the-week/'

async function scrape(page: Page): Promise<Album[]> {
  return page.evaluate(() => {
    const SELECTOR = '.article-card__title a'

    let albums: Album[] = []
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

export const albumOfTheWeek: List = {
  URL,
  save: save(PATH),
  scrape,
}
