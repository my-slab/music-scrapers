import { Album, List } from '../../types';
import { Page } from 'puppeteer';

export const bestNewAlbums: List = {
  URL: 'https://pitchfork.com/reviews/best/albums',
  name: 'Best New Albums',
  save: () => {},
  scrape,
};

async function scrape(page: Page): Promise<Album[]> {
  return page.evaluate(() => {
    const SELECTOR = '.review .review__title';

    let albums: Album[] = [];
    for (let { children } of document.querySelectorAll(SELECTOR)) {
      let [artist, title] = [
        children[0] as HTMLElement,
        children[1] as HTMLElement,
      ];

      // Pitchfork will group multiple releases with a slash
      // e.g. Adrianne Lenker - songs/instrumentals
      let titles = title.innerText.split('/');
      if (titles.length > 1) {
        for (let t of titles)
          albums.push({ artist: artist.innerText, title: t });
      } else {
        // Pitchfork will group multiple artists in <li> elements.
        if (artist.children.length > 1) {
          let artists: string = '';
          for (let c of artist.children)
            artists = artists + ' ' + (c as HTMLElement).innerText;

          albums.push({
            artist: artists,
            title: title.innerText,
          });
        } else {
          albums.push({
            artist: artist.innerText,
            title: title.innerText,
          });
        }
      }
    }

    return albums;
  });
}
