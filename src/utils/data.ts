import { isEqual, unescape, uniqWith } from 'lodash'

import { Albums } from '../types'
import { read, write } from './file'

/**
 * @name cleanAlbums
 *
 * @description Normalize scraped text.
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
	for (let album of albums) {
		let artist = album.artist
		let title = album.title
		artist = cleanText(artist)
		title = cleanText(title)
		cleanedAlbums.push({ artist, title })
	}
	return cleanedAlbums
}

/**
 * @name save
 *
 * @description Save a list to file
 *
 * @example
 * let saveList = save('./here.json')
 * saveList([{artist: "Charli XCX", title: "how i'm feeling now"}])
 */
export function save(path: string): (albums: Albums) => Promise<void> {
	return async function (albums: Albums): Promise<void> {
		let savedAlbums = await read(path)
		let data = uniqWith([...albums, ...savedAlbums], isEqual)
		write(path, [['artist', 'title'], ...data] as Albums)
	}
}
