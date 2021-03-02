import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import { Page } from 'puppeteer';

import { Album, PublicationQuery } from '../../types';
import { read, write } from '../../utils';

const URL = 'https://www.stereogum.com/category/reviews/album-of-the-week/';

async function scrape(page: Page): Promise<Album[]> {
  return page.evaluate((e) => {
    const SELECTOR = ['.article-card__title', 'a'].join(' ');

    let albums: Album[] = [];
    for (let { childNodes } of document.querySelectorAll(SELECTOR)) {
      let [artist, title] = [
        childNodes[0] as ChildNode,
        childNodes[1] as HTMLElement,
      ];

      albums.push({
        artist: (artist.textContent || '')
          .split('Album Of The Week:')[1]
          .trim(),
        title: title.innerText,
      });
    }

    return albums;
  });
}

async function save(albums: Album[]) {
  const PATH = './data/stereogum/album-of-the-week/albums.json';

  let data = read(PATH);
  data = JSON.stringify(uniqWith([...data, ...albums], isEqual));
  write(PATH, data);
}

export const albumOfTheWeek: PublicationQuery = {
  URL,
  save,
  scrape,
};
