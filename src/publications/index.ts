import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';

import { read, write } from '../utils';
import { Album } from '../types';

export * from './pitchfork';
export * from './stereogum';
export * from './the-needle-drop';

export function save(path: string) {
  return function (albums: Album[]) {
    let data = read(path);
    data = JSON.stringify(uniqWith([...albums, ...data], isEqual));
    write(path, data);
  };
}
