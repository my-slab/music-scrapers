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

interface Artist {
  id: string;
  name: string;
}

export interface Release {
  type: 'release' | 'release-group';
  id: string;
  title: string;
  cover: Cover;
}

export interface Cover {
  small: string;
  large: string;
}

export interface Releases extends Artist {
  release: Release;
}
