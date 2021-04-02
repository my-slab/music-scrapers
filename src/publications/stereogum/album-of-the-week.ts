import unescape from 'lodash/unescape'
import { Album, PublicationQuery } from '../../types'
import { Page } from 'puppeteer'
import { save } from '../index'

const PATH = './data/raw/stereogum/album-of-the-week.json'
const URL = 'https://www.stereogum.com/category/reviews/album-of-the-week/'

async function scrape(page: Page): Promise<Album[]> {
  return page.evaluate((e) => {
    const SELECTOR = ['.article-card__title', 'a'].join(' ')

    let albums: Album[] = []
    for (let { childNodes } of document.querySelectorAll(SELECTOR)) {
      let [artist, title] = [childNodes[0] as ChildNode, childNodes[1] as HTMLElement]

      albums.push({
        artist: unescape((artist.textContent || '').split('Album Of The Week:')[1]),
        title: unescape(title.innerText),
      })
    }

    return albums
  })
}

export const albumOfTheWeek: PublicationQuery = {
  URL,
  save: save(PATH),
  scrape,
}
