import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import { Page } from 'puppeteer';

import { Album, PublicationQuery } from '../../types';
import { read, write } from '../../utils';

const URL = 'https://www.theneedledrop.com/loved-list';

async function scrape(page: Page): Promise<Album[]> {
  return page.evaluate((e) => {
    const SELECTOR = 'p:first-child strong + a';

    let albums: Album[] = [];
    for (let { innerHTML } of document.querySelectorAll(SELECTOR)) {
      let [artist, title] = innerHTML.split('-');

      albums.push({
        artist: artist.trim(),
        title: title.trim(),
      });
    }

    return albums;
  });
}

async function save(albums: Album[]) {
  const PATH = './data/the-needle-drop/loved-list/albums.json';

  let data = read(PATH);
  data = JSON.stringify(uniqWith([...data, ...albums], isEqual));
  write(PATH, data);
}

export const lovedList: PublicationQuery = {
  URL,
  save,
  scrape,
};
