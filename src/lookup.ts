import fetch from 'isomorphic-unfetch'
import fs from 'fs'
import {
  Album,
  Artist,
  ArtistCreditResponse,
  Cover,
  Maybe,
  Release,
  ReleaseQueryResponse,
  ReleaseResponse,
} from './types'
import { backOff } from 'exponential-backoff'
import { distance } from './utils'

/**
 * coverArtArchive
 *
 * @see https://coverartarchive.org/
 */
const coverArtArchive = {
  url: 'https://coverartarchive.org',
  opts: { headers: { Accept: 'application/json' } },
  async release({ id }: { id: string }) {
    let url = `${this.url}/release/${id}`
    return backOff(() => fetch(url, this.opts).then((r) => r.json()))
  },
}

/**
 * musicBrainz
 *
 * @see https://musicbrainz.org/doc/MusicBrainz_API
 */
const musicBrainz = {
  url: 'https://musicbrainz.org/ws/2',
  opts: { headers: { Accept: 'application/json' } },
  /**
   * release
   *
   * Fetch a specific release entity by id.
   *
   * @example
   * let release = await musicBrainz.release({id: '0690e824-9bbd-4b09-bf5d-673394ca5afe'})
   *
   */
  async release({ id }: { id: string }): Promise<ReleaseResponse> {
    let url = `${this.url}/release/${id}`
    return backOff(() => fetch(url, this.opts).then((r) => r.json()))
  },
  async releaseQuery({ offset = 0, title }: { offset?: number; title: string }) {
    let url = `${this.url}/release?query=${title}&status=official&type=${encodeURIComponent(
      'album|ep'
    )}&offset=${offset}`
    return backOff(() => fetch(url, this.opts).then((r) => r.json()))
  },
}

/**
 * getArtistDisplayName
 *
 * Join together a release's artists according to the joinphrase property.
 *
 * @example
 * getArtistDisplayName([{ name: 'Nick Cave', joinphrase: '&', ... }, { name: 'Warren Ellis', ... }])
 * // 'Nick Cave & Warren Ellis'
 */
function getArtistDisplayName(artists: ArtistCreditResponse[]): string {
  let displayName = ''
  let artist: ArtistCreditResponse
  for (artist of artists) {
    displayName = displayName + artist.name + (artist.joinphrase || '')
  }
  return displayName
}

/**
 * pickRelease
 *
 * Pick the properties from a `ReleaseQueryResponse` that are relevant.
 *
 * @example
 * let release = pickRelease({ ... })
 * let { artistDisplayName } = release
 */
function pickRelease(release: ReleaseQueryResponse): Release {
  let { 'artist-credit': artists } = release
  let { date, id, title } = release
  let artistDisplayName = getArtistDisplayName(artists)
  return { artistDisplayName, artists: artists.map(({ artist }: { artist: Artist }) => artist), date, id, title }
}

/**
 * isArtistMatch
 *
 * Check if two artist name strings are similar.
 *
 * @example
 * isArtistMatch('Charli XCX', 'Charlie XCX')
 * // true
 */
function isArtistMatch(a: string, b: string): boolean {
  return distance(a, b) >= 0.8
}

/**
 * fetchRelease
 *
 * Find a release matching the given artist name and release title.
 *
 * @example
 * fetchRelease({artist: 'Charli XCX', title: "how i'm feeling now"})
 */
async function fetchRelease({ artist, title }: { artist: string; title: string }): Promise<Maybe<Release>> {
  let count = Infinity
  let offset = 0
  let score = 100
  while (offset < count && score > 70) {
    let result = await musicBrainz.releaseQuery({ offset, title })
    count = result.count

    for (let r of result.releases) {
      score = r.score
      let release = pickRelease(r)
      if (isArtistMatch(artist, release.artistDisplayName)) return release
    }
    offset = offset + 25
  }
}

/**
 * hasCoverArt
 *
 * Check if a release has cover art.
 *
 * @example
 * hasCoverArt(release)
 * // true
 */
function hasCoverArt(release: ReleaseResponse): boolean {
  let { 'cover-art-archive': coverArtArchive } = release
  let { front } = coverArtArchive

  return front
}

/**
 * fetchCover
 *
 * Fetch a release's cover art.
 *
 * @example
 * let cover = await fetchCover({id: '0690e824-9bbd-4b09-bf5d-673394ca5afe'})
 */
async function fetchCover({ id }: { id: string }): Promise<Maybe<Cover>> {
  let release = await musicBrainz.release({ id })
  if (release && hasCoverArt(release)) {
    let coverArt = await coverArtArchive.release({ id })

    if (coverArt) {
      let { images } = coverArt
      let [
        {
          id: coverId,
          thumbnails: { small, large },
        },
      ] = images

      return { id: coverId, small, large }
    }
  }
}

export async function lookup() {
  let inPath = './data/raw'
  let outPath = './data'
  let filePaths = ['/stereogum/heavy-rotation.json']
  let releases: Release[] = []

  for (let filePath of filePaths) {
    console.log(`Lookup::${filePath}`)
    let file = fs.readFileSync(`${inPath}${filePath}`)
    let data = JSON.parse(file.toString())

    for (let datum of data) {
      let { artist, title }: Album = datum
      console.log(`\t${artist} - ${title}`)

      let partialRelease = await fetchRelease({ artist, title })
      if (partialRelease) {
        let cover = await fetchCover({ id: partialRelease.id })
        releases.push({ ...partialRelease, cover })
      } else {
        // TODO: capture not found
        console.log(`\t\tNot found`)
      }
    }

    fs.writeFileSync(`${outPath}${filePath}`, JSON.stringify(releases))
  }
}
