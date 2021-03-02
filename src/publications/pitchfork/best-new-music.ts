import { Album, PublicationQuery } from '../../types';
import { Page } from 'puppeteer';
import { save } from '../index';

const PATH = './data/pitchfork/best-new-music/albums.json';
const URL = 'https://pitchfork.com/reviews/best/albums';

async function scrape(page: Page): Promise<Album[]> {
  return page.evaluate((e) => {
    const SELECTOR = ['.review', '.review__title'].join(' ');

    let albums: Album[] = [];
    for (let { children } of document.querySelectorAll(SELECTOR)) {
      let [artist, title] = [
        children[0] as HTMLElement,
        children[1] as HTMLElement,
      ];

      albums.push({
        artist: artist.innerText,
        title: title.innerText,
      });
    }

    return albums;
  });
}

export const bestNewMusic: PublicationQuery = {
  URL,
  save: save(PATH),
  scrape,
};
