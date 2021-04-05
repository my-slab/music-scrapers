import unescape from 'lodash/unescape'
import { Album } from '../types'

/**
 * cleanAlbums
 *
 * Normalize scraped text.
 *
 * @param albums Album[]
 *
 * @example
 * cleanAlbums([{artist: "Charli XCX", title: "how i'm feeling now"}])
 */
export function cleanAlbums(albums: Album[]) {
  function cleanText(text: string) {
    text = text.trim()
    text = unescape(text)
    text = text.replace('’', "'")
    return text
  }

  let cleanedAlbums: Album[] = []
  albums.map((album) => {
    let artist = album.artist
    let title = album.title

    if (Array.isArray(artist)) artist = artist.map(cleanText)
    else {
      artist = cleanText(artist)
      title = cleanText(title)
    }

    cleanedAlbums.push({ artist, title })
  })

  return cleanedAlbums
}
