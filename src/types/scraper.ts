import { Page } from 'puppeteer'

export interface Album {
  artist: string
  title: string
}

export interface List {
  URL: string
  save: (albums: Album[]) => void
  scrape: (page: Page) => Promise<Album[]>
}
