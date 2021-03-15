import { scrape } from './scrape';
import { lookup } from './lookup';

(async () => {
  await scrape();
  await lookup();
})();
