import { bestNewMusic } from './publications/pitchfork/best-new-music';
import { goto, launch, teardown } from './utils';

(async () => {
  let browser = await launch();
  let page = await goto(browser, bestNewMusic.URL);
  let albums = await bestNewMusic.scrape(page);
  await bestNewMusic.save(albums);
  await teardown(browser);
})();
