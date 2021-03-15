import { Page } from 'puppeteer';

export interface Album {
  artist: string;
  title: string;
}

export interface PublicationQuery {
  URL: string;
  save: (albums: Album[]) => void;
  scrape: (page: Page) => Promise<Album[]>;
}
