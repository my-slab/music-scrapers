import isEqual from 'lodash/isEqual'
import uniqWith from 'lodash/uniqWith'
import { Album } from '../types'
import { read, write } from '../utils'

export { pitchfork } from './pitchfork'
export { stereogum } from './stereogum'
export { theNeedleDrop } from './the-needle-drop'

export function save(path: string) {
  return function (albums: Album[]) {
    let data = read(path)
    data = JSON.stringify(uniqWith([...albums, ...data], isEqual))
    write(path, data)
  }
}
