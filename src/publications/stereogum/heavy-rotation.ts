import { Album, PublicationQuery } from '../../types';
import { Page } from 'puppeteer';
import { save } from '../index';

const PATH = './data/raw/stereogum/heavy-rotation.json';
const URL = 'https://www.stereogum.com/heavy-rotation';

async function scrape(page: Page): Promise<Album[]> {
  return page.evaluate((e) => {
    const SELECTOR = ['.article-card__title', 'a'].join(' ');

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

export const heavyRotation: PublicationQuery = {
  URL,
  save: save(PATH),
  scrape,
};
