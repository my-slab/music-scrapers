export interface Release {
  artistDisplayName: string
  artists: Artist[]
  cover?: Cover
  date: string
  id: string
  title: string
}

export interface Artist {
  id: string
  name: string
  sortName: string
}

export interface Cover {
  id: string
  large: string
  small: string
}

export interface ArtistCreditResponse {
  artist: Artist
  joinphrase?: string
  name: string
}

export interface ReleaseQueryResponse {
  'artist-credit': ArtistCreditResponse[]
  date: string
  id: string
  title: string
}

export interface ReleaseResponse {
  'cover-art-archive': {
    front: boolean
  }
}
