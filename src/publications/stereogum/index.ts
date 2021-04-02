import { PublicationQuery } from '../../types'
import { albumOfTheWeek } from './album-of-the-week'
import { heavyRotation } from './heavy-rotation'

export let stereogum = {
  albumOfTheWeek,
  heavyRotation,
}

export interface Stereogum {
  albumOfTheWeek: PublicationQuery
  heavyRotation: PublicationQuery
}
