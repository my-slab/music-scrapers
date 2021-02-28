import { Page } from 'puppeteer';

export interface Album {
  artist: String;
  title: String;
}

export interface PublicationQuery {
  URL: string;
  save: (albums: Album[]) => void;
  scrape: (page: Page) => Promise<Album[]>;
}
