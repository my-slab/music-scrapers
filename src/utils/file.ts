import { createReadStream } from 'fs'
import { parseStream } from '@fast-csv/parse'
import { writeToPath } from '@fast-csv/format'

import { Albums, Album } from '../types'

/**
 * @name read
 *
 * @description Read data from a file.
 *
 * @example
 * let data = read('./albums.csv')
 */
export function read(path: string): Promise<Albums> {
	const stream = createReadStream(path)

	let data: Albums = []
	return new Promise((resolve, reject) => {
		parseStream(stream, { headers: true, ignoreEmpty: true })
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			.transform((data: any): Album => {
				let { artist, title } = data as Album

				return {
					artist,
					title,
				}
			})
			.on('error', (error: Error) => reject(error))
			.on('data', (row: Album) => data.push(row))
			.on('end', () => resolve(data))
	})
}

/**
 * @name write
 *
 * @description Write data to a file.
 *
 * @example
 * write('./albums.csv', "[]")
 */
export function write(path: string, data: Albums): void {
	new Promise<void>((resolve, reject) => {
		writeToPath(path, data)
			.on('error', (err) => reject(err))
			.on('end', () => resolve())
	})
}
