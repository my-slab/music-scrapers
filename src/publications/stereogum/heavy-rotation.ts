import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import { Page } from 'puppeteer';

import { Album, PublicationQuery } from '../../types';
import { read, write } from '../../utils';

const URL = 'https://www.stereogum.com/heavy-rotation';

async function scrape(page: Page): Promise<Album[]> {
  return page.evaluate((e) => {
    const SELECTOR = ['.article-card__title', 'a'].join(' ');

    let albums: Album[] = [];
    for (let element of document.querySelectorAll(SELECTOR)) {
      let [artist, title] = (element as HTMLElement).innerText.split('-');

      albums.push({
        artist: artist.trim(),
        title: title.trim(),
      });
    }

    return albums;
  });
}

async function save(albums: Album[]) {
  const PATH = './data/stereogum/heavy-rotation/albums.json';

  let data = read(PATH);
  data = JSON.stringify(uniqWith([...data, ...albums], isEqual));
  write(PATH, data);
}

export const heavyRotation: PublicationQuery = {
  URL,
  save,
  scrape,
};
