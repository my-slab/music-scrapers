import fs from 'fs'

/**
 *
 * @param path
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
 *
 * @param path
 * @param data
 *
 * @example
 * write('./albums.json', [])
 */
export function write(path: string, data: string) {
  fs.writeFileSync(path, data)
}
