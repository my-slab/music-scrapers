import process from 'process'
import { scrape } from './scrape'
;(async () => {
  try {
    await scrape()
  } finally {
    process.exit()
  }
})()
