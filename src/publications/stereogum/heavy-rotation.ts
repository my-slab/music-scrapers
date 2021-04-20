import { Albums, List } from '../../types'
import { Page } from 'puppeteer'
import { save } from '../../utils'

export const heavyRotation: List = {
  URL: 'https://www.stereogum.com/heavy-rotation',
  name: 'Heavy Rotation',
  save: save('./data/stereogum/heavy-rotation.json'),
  scrape,
}

async function scrape(page: Page): Promise<Albums> {
  return page.evaluate(() => {
    const SELECTOR = '.article-card__title a'

    let albums: Albums = []
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
