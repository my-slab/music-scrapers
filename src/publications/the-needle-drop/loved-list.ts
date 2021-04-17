import { Album, List } from '../../../types';
import { Page } from 'puppeteer';

export const lovedList: List = {
  URL: 'https://www.theneedledrop.com/loved-list',
  name: 'Loved List',
  save: () => {},
  scrape,
};

async function scrape(page: Page): Promise<Album[]> {
  return page.evaluate(() => {
    const SELECTOR = '.article-card__title a';

    let albums: Album[] = [];
    for (let element of document.querySelectorAll(SELECTOR)) {
      let [artist, title] = (element as HTMLElement).innerText.split('-');
      albums.push({
        artist: artist,
        title: title,
      });
    }

    return albums;
  });
}
