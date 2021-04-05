import unescape from 'lodash/unescape'
import { Album } from '../types'

export * from './browser'
export * from './file'

/** cleanAlbums */
export function cleanAlbums(albums: Album[]) {
  function cleanText(text: string) {
    text = text.trim()
    text = unescape(text)
    text = text.replace('’', "'")
    return text
  }

  let cleanedAlbums: Album[] = []
  albums.map((album) => {
    let [artist, title] = Object.values(album)
    artist = cleanText(artist)
    title = cleanText(title)
    cleanedAlbums.push({ artist, title })
  })

  return cleanedAlbums
}

function msleep(n: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n)
}

export function sleep(n: number) {
  msleep(n * 1000)
}
