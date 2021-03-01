import { bestNewMusic } from './publications/pitchfork/best-new-music';
import { albumOfTheWeek } from './publications/stereogum/album-of-the-week';
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
  await Promise.all([task(bestNewMusic), task(albumOfTheWeek)]);
})();
