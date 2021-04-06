import unescape from 'lodash/unescape'
import isEqual from 'lodash/isEqual'
import uniqWith from 'lodash/uniqWith'
import { Album } from '../types'
import { read, write } from './file'

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

/**
 * save
 *
 * Save a list to file
 *
 * @param path string
 *
 * @example
 * let saveList = save('./here.json')
 * saveList([{artist: "Charli XCX", title: "how i'm feeling now"}])
 */
export function save(path: string) {
  return function (albums: Album[]) {
    let data = read(path)
    data = JSON.stringify(uniqWith([...albums, ...data], isEqual))
    write(path, data)
  }
}
