/**
 * The two nlp libraries is probably overkill - but cbf doing this myself.
 */
import natural from 'natural'
import nlp from 'compromise'

/**
 * normalize
 *
 * Clean up text so there is less _distance_ in later comparisons.
 *
 * @see https://observablehq.com/@spencermountain/compromise-normalization
 *
 * @example
 * normalize('Björk')
 * // 'bjork'
 */
export function normalize(s: string) {
  return nlp.tokenize(s).toLowerCase().normalize().text()
}

/**
 * distance
 *
 * Calculate the Jaro-Winkler string distance.
 *
 * @see http://naturalnode.github.io/natural/string_distance.html
 *
 * @example
 * distance('Charli XCX', 'Charlie XCX')
 * // 0.9818181818181818
 */
export function distance(a: string, b: string): number {
  return natural.JaroWinklerDistance(normalize(a), normalize(b))
}
