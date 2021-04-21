import { Albums } from '../types'
import { isEqual, unescape, uniqWith } from 'lodash'
import { read, write } from './file'

/**
 * cleanAlbums
 *
 * Normalize scraped text.
 *
 * @example
 * cleanAlbums([{artist: "Charli XCX", title: "how i’m feeling now"}])
 * // [{artist: "Charli XCX", title: "how i'm feeling now"}]
 */
export function cleanAlbums(albums: Albums): Albums {
	function cleanText(text: string) {
		text = text.trim()
		text = unescape(text)
		text = text.replace('’', "'")
		return text
	}

	let cleanedAlbums: Albums = []
	albums.map((album) => {
		let artist = album.artist
		let title = album.title
		artist = cleanText(artist)
		title = cleanText(title)
		cleanedAlbums.push({ artist, title })
	})

	return cleanedAlbums
}

/**
 * save
 *
 * Save a list to file
 *
 * @example
 * let saveList = save('./here.json')
 * saveList([{artist: "Charli XCX", title: "how i'm feeling now"}])
 */
export function save(path: string) {
	return function (albums: Albums): void {
		let savedAlbums = read(path)
		let data = JSON.stringify(uniqWith([...albums, ...savedAlbums], isEqual))
		write(path, data)
	}
}
