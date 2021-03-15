import fs from 'fs';
import fetch from 'isomorphic-unfetch';
import { Artist, Cover, Release, Releases } from './types';
import { sleep } from './utils';

const MUSIC_BRAINZ_URL = 'https://musicbrainz.org/ws/2/';
const COVER_ARCHIVE_URL = 'https://coverartarchive.org/';

async function fetchArtist(
  artist: string
): Promise<{ id: string; name: string }> {
  let url = `${MUSIC_BRAINZ_URL}artist?query=${artist}`;

  return fetch(url, { headers: { Accept: 'application/json' } })
    .then((r) => r.json())
    .then((r) => {
      let { artists } = r;
      let [{ id, name }] = artists;
      return { id, name };
    });
}

async function fetchRelease(
  artistId: string,
  title: string
): Promise<{ type: 'release' | 'release-group'; id: string; title: string }> {
  let releaseUrl = `${MUSIC_BRAINZ_URL}release?artist=${artistId}&status=official&type=album|ep`;
  let releaseGroupUrl = `${MUSIC_BRAINZ_URL}release-group?artist=${artistId}&type=album|ep`;

  async function _fetchRelease(
    url: string,
    kind: 'releases' | 'release-groups'
  ) {
    return fetch(url, {
      headers: { Accept: 'application/json' },
    })
      .then((r) => r.json())
      .then((r) => {
        let { [kind]: releases } = r;
        let id;
        for (let release of releases) {
          let {
            title: _title,
            id: _id,
          }: { title: string; id: string } = release;
          if (_title.toLowerCase().trim() == title.toLowerCase().trim()) {
            id = _id;
            return { id, title };
          }
        }
      });
  }

  let release = await _fetchRelease(releaseUrl, 'releases');
  let releaseGroup = await _fetchRelease(releaseGroupUrl, 'release-groups');
  // @ts-ignore
  return release
    ? { type: 'release', ...release }
    : { type: 'release-group', ...releaseGroup };
}

async function fetchCover(release: Omit<Release, 'cover'>) {
  let url;
  switch (release.type) {
    case 'release':
      url = `${COVER_ARCHIVE_URL}/release/${release.id}`;
      break;
    case 'release-group':
      url = `${COVER_ARCHIVE_URL}/release-group/${release.id}`;
      break;
  }

  return fetch(url)
    .then((r) => r.json())
    .then((r) => {
      let { images } = r;
      let [
        {
          thumbnails: { small, large },
        },
      ] = images;

      return { small, large };
    });
}

export async function lookup() {
  let inPath = './data/raw';
  let outPath = './data';
  let filePaths = [
    '/pitchfork/best-new-music.json',
    '/stereogum/heavy-rotation.json',
    '/stereogum/album-of-the-week.json',
    '/the-needle-drop/loved-list.json',
  ];

  for (let filePath of filePaths) {
    let file = fs.readFileSync(`${inPath}${filePath}`);
    let data = JSON.parse(file.toString());
    let entries: Releases[] = [];
    console.log(`Lookup::${filePath}`);

    for (let d of data) {
      let { artist: a, title } = d;
      console.log(`\t${a} - ${title}`);

      sleep(3);

      try {
        let artist: Artist = await fetchArtist(a);
        let release: Omit<Release, 'cover'> = await fetchRelease(
          artist.id,
          title
        );
        let cover: Cover = await fetchCover(release);

        entries.push({ ...artist, release: { ...release, cover } });
      } catch (e) {
        console.log(e);
        console.log('🚨', `\tError::${a} - ${title}`, '🚨');
      }
    }

    fs.writeFileSync(`${outPath}${filePath}`, JSON.stringify(entries));
  }
}
