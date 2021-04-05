import { Album, List } from '../../types'
import { Page } from 'puppeteer'
import { save } from '../index'

const PATH = './data/raw/pitchfork/best-new-music.json'
const URL = 'https://pitchfork.com/reviews/best/albums'

async function scrape(page: Page): Promise<Album[]> {
  return page.evaluate(() => {
    const SELECTOR = '.review .review__title'

    let albums: Album[] = []
    for (let { children } of document.querySelectorAll(SELECTOR)) {
      let [artist, title] = [children[0] as HTMLElement, children[1] as HTMLElement]

      // Pitchfork will group multiple releases with a slash
      // e.g. Adrianne Lenker - songs/instrumentals
      let titles = title.innerText.split('/')
      if (titles.length > 1) {
        for (let t of titles) albums.push({ artist: artist.innerText, title: t })
      } else {
        // Pitchfork will group multiple artists in <li>
        // elements, so we just grab the first one.
        if (artist.children.length > 1) {
          albums.push({
            artist: (artist.children[0] as HTMLElement).innerText,
            title: title.innerText,
          })
        } else {
          albums.push({
            artist: artist.innerText,
            title: title.innerText,
          })
        }
      }
    }

    return albums
  })
}

export const bestNewMusic: List = {
  URL,
  save: save(PATH),
  scrape,
}
