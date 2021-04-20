import { Page } from 'puppeteer'

export interface Album {
  artist: string
  title: string
}

export type Albums = Album[]

export interface List {
  URL: string
  name: string
  save: (albums: Albums) => void
  scrape: (page: Page) => Promise<Albums>
}
