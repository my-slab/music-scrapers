import * as publications from './publications';
import { PublicationQuery } from './types';
import { goto, launch, teardown } from './utils';

async function task(publicationQuery: PublicationQuery) {
  let browser = await launch();
  let page = await goto(browser, publicationQuery.URL);
  let albums = await publicationQuery.scrape(page);
  await publicationQuery.save(albums);
  await teardown(browser);
}

(async () => {
  let p: keyof typeof publications;
  for (p in publications) {
    let publication = publications[p];
    for (let pq in publication) {
      let publicationQuery = (<any>publication)[pq];
      await task(publicationQuery);
    }
  }
})();
