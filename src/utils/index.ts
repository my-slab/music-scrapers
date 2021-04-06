export { cleanAlbums, save } from './data'
export { goto, launch, teardown } from './browser'
export { read, write } from './file'

/**
 * sleep
 *
 * Sleep for n of seconds
 *
 * @param n number
 *
 * @example
 * sleep(1)
 */
export function sleep(n: number) {
  msleep(n * 1000)
}

/**
 * msleep
 *
 * Sleep for n of milliseconds
 *
 * @param n number
 *
 * @example
 * msleep(1000)
 */
function msleep(n: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n)
}
