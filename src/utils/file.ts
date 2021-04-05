import fs from 'fs'

/**
 * read
 *
 * Read data from a file.
 *
 * @param path string
 *
 * @example
 * let data = read('./albums.json')
 */
export function read(path: string) {
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
 * @param path string
 * @param data string
 *
 * @example
 * write('./albums.json', "[]")
 */
export function write(path: string, data: string) {
  fs.writeFileSync(path, data)
}
