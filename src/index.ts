import process from 'process'
import { lookup } from './lookup'
import { scrape } from './scrape'
;(async () => {
  await scrape()
  // await lookup()
  process.exit()
})()
