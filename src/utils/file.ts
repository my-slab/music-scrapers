import fs from 'fs'
import { Albums } from '../types'

/**
 * read
 *
 * Read data from a file.
 *
 * @example
 * let data = read('./albums.json')
 */
export function read(path: string): Albums {
  try {
    let file = fs.readFileSync(path)
    return JSON.parse(file.toString())
  } catch (error) {
    return []
  }
}

/**
 * write
 *
 * Write data to a file.
 *
 * @example
 * write('./albums.json', "[]")
 */
export function write(path: string, data: string): void {
  fs.writeFileSync(path, data)
}
