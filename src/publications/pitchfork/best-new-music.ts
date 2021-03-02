import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import { Page } from 'puppeteer';

import { Album, PublicationQuery } from '../../types';
import { read, write } from '../../utils';

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

async function save(albums: Album[]) {
  const PATH = './data/pitchfork/best-new-music/albums.json';

  let data = read(PATH);
  data = JSON.stringify(uniqWith([...data, ...albums], isEqual));
  write(PATH, data);
}

export const bestNewMusic: PublicationQuery = {
  URL,
  save,
  scrape,
};
