import * as publications from './publications';
import { PublicationQuery } from './types';
import { cleanAlbums, goto, launch, teardown } from './utils';

async function task(publicationQuery: PublicationQuery) {
  console.log('Fetching::', publicationQuery.URL, '\n');

  let browser = await launch();
  let page = await goto(browser, publicationQuery.URL);
  let albums = await publicationQuery.scrape(page);
  albums = cleanAlbums(albums);
  publicationQuery.save(albums);
  await teardown(browser);
}

async function scrape() {
  let p: keyof typeof publications;
  for (p in publications) {
    let publication = publications[p];
    for (let pq in publication) {
      let publicationQuery = (<any>publication)[pq];
      await task(publicationQuery);
    }
  }
}

(async () => {
  await scrape();
})();
