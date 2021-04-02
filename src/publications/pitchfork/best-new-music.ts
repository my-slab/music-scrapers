import unescape from 'lodash/unescape'
import { Album, PublicationQuery } from '../../types'
import { Page } from 'puppeteer'
import { save } from '../index'

const PATH = './data/raw/pitchfork/best-new-music.json'
const URL = 'https://pitchfork.com/reviews/best/albums'

async function scrape(page: Page): Promise<Album[]> {
  return page.evaluate((e) => {
    const SELECTOR = ['.review', '.review__title'].join(' ')

    let albums: Album[] = []
    for (let { children } of document.querySelectorAll(SELECTOR)) {
      let [artist, title] = [children[0] as HTMLElement, children[1] as HTMLElement]

      // Pitchfork will group multiple releases with a slash
      // e.g. Adrianne Lenker - songs/instrumentals
      let titles = title.innerText.split('/')
      if (titles.length > 1) {
        for (let t of titles) albums.push({ artist: artist.innerText, title: t })
      } else {
        albums.push({
          artist: unescape(artist.innerText),
          title: unescape(title.innerText),
        })
      }
    }

    return albums
  })
}

export const bestNewMusic: PublicationQuery = {
  URL,
  save: save(PATH),
  scrape,
}
