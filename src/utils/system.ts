/**
 * sleep
 *
 * Sleep for n seconds
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
 * Sleep for n milliseconds
 *
 * @example
 * msleep(1000)
 */
function msleep(n: number) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, n)
}
