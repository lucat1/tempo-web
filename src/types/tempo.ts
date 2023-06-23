type ObjectValues<T> = T[keyof T]

export const ResourceTypeValue = {
  server: "server",
  auth: "auth",
  user: "user",

  artist: "artist",
  track: "track",
  release: "release",
  medium: "medium",
  image: "image"
} as const
export type ResourceType = ObjectValues<typeof ResourceTypeValue>

export interface Resource<
  T extends ResourceType,
  A,
  K extends string,
  RT extends { [k in K]: ResourceType }
> {
  id: string
  type: T
  attributes: A
  relationships: {
    [key in K]:
    | {
      data: Relation<RT[key]> | Relation<RT[key]>[]
    }
    | undefined
  }
}

export interface Relation<T extends ResourceType> {
  type: T
  id: string
  meta: {
    join_phrase: string
    [k: string]: string | undefined
  }
}

export interface Document<
  K extends string,
  RT extends { [k in K]: ResourceType },
  R extends Resource<any, any, K, RT>,
  Rs extends Resource<RT[K], any, any, any> | null
> {
  data: R
  included: Rs[]
  meta: {
    prev: string
    next: string
    first: string
    last: string
    [k: string]: string | undefined
  }
}

export interface MultiDocument<
  K extends string,
  RT extends { [k in K]: ResourceType },
  R extends Resource<any, any, K, RT>,
  Rs extends Resource<RT[K], any, any, any>
> {
  data: R[]
  included: Rs[]
  meta: {
    prev: string
    next: string
    first: string
    last: string
    [k: string]: string | undefined
  }
}

export interface Error {
  status: number
  title: string
  detail: string
}

export interface ServerAttributes {
  "aura-version": string
  server: string
  "server-version": string
  "auth-required": string
  features: string[]
}

export const ServerRelatedValue = {} as const

export type ServerRelated = ObjectValues<typeof ServerRelatedValue>

export const ServerRelatedType = {} as const

export type ServerResource = Resource<
  typeof ResourceTypeValue.server,
  ServerAttributes,
  ServerRelated,
  typeof ServerRelatedType
>
export type ServerTrackDocument = Document<
  ServerRelated,
  typeof ServerRelatedType,
  ServerResource,
  null
>

export interface AuthToken {
  value: string
  expires_at: string
}

export interface AuthAttributes {
  token: AuthToken
  refresh: AuthToken
}

export const AuthRelatedValue = {
  user: "user"
}
export type AuthRelated = ObjectValues<typeof AuthRelatedValue>

export const AuthRelatedType = {
  [AuthRelatedValue.user]: ResourceTypeValue.user
} as const

export type AuthResource = Resource<
  typeof ResourceTypeValue.auth,
  AuthAttributes,
  AuthRelated,
  typeof AuthRelatedType
>
export type AuthTrackDocument = Document<
  AuthRelated,
  typeof AuthRelatedType,
  AuthResource,
  null
>

// TODO
// export type UserResource = Resource<AuthAttributes, AuthRelated>

export interface ArtistAttributes {
  id: string
  name: string
  sort_name: string
  description: string
  links: {
    [k: string]: string
  }
}

export const ArtistRelatedValue = {
  recordings: "recordings",
  tracks: "tracks",
  releases: "releases",
  images: "images"
}
export type ArtistRelated = ObjectValues<typeof ArtistRelatedValue>

export const ArtistRelatedType = {
  [ArtistRelatedValue.recordings]: ResourceTypeValue.track,
  [ArtistRelatedValue.tracks]: ResourceTypeValue.track,
  [ArtistRelatedValue.releases]: ResourceTypeValue.release,
  [ArtistRelatedValue.images]: ResourceTypeValue.image
} as const

export type ArtistResource = Resource<
  typeof ResourceTypeValue.artist,
  ArtistAttributes,
  ArtistRelated,
  typeof ArtistRelatedType
>
export type ArtistDocument = Document<
  ArtistResource,
  ReleaseResource | TrackResource /* TODO image */
>
export type ArtistsDocument = Document<
  ArtistResource[],
  ReleaseResource /* TODO */
>

export interface ReleaseAttributes {
  id: string
  title: string
  disctotal: number
  tracktotal: number
  genres: string[]
  "release-type": string
  year: number
  month: number
  day: number
  original_year: number
  original_month: number
  original_day: number
}

export const ReleaseRelatedValue = {
  artists: "artists",
  mediums: "mediums",
  image: "image"
} as const
export type ReleaseRelated = ObjectValues<typeof ReleaseRelatedValue>

export const ReleaseRelatedType = {
  [ReleaseRelatedValue.artists]: ResourceTypeValue.artist,
  [ReleaseRelatedValue.mediums]: ResourceTypeValue.medium,
  [ReleaseRelatedValue.image]: ResourceTypeValue.image
} as const

export type ReleaseResource = Resource<
  typeof ResourceTypeValue.release,
  ReleaseAttributes,
  ReleaseRelated,
  typeof ReleaseRelatedType
>
// export type ReleaseDocument = Document<
//   ReleaseResource,
//   ArtistResource | MediumResource | TrackResource /* TODO */
// >
// export type ReleasesDocument = Document<
//   ReleaseResource[],
//   ArtistResource | MediumResource /* TODO */
// >

export interface MediumAttributes {
  id: string
  format: string
  position: number
  "track-offset": number
  tracks: number
}

export const MediumRelatedValue = {
  release: "release",
  tracks: "tracks"
} as const
export type MediumRelated = ObjectValues<typeof MediumRelatedValue>

export const MediumRelatedType = {
  [MediumRelatedValue.release]: ResourceTypeValue.release,
  [MediumRelatedValue.tracks]: ResourceTypeValue.track
} as const

export type MediumResource = Resource<
  typeof ResourceTypeValue.medium,
  MediumAttributes,
  MediumRelated,
  typeof MediumRelatedType
>
// export type MediumDocument = Document<
//   MediumResource,
//   ReleaseResource | TrackResource /* TODO */
// >
// export type MediumsDocument = Document<
//   MediumResource[],
//   ArtistResource | TrackResource /* TODO */
// >

export interface TrackAttributes {
  id: string
  title: string
  disc: number
  duration: number
  genres: string[]
  mimetype: string
  "recording-mbid": string
  track: number
  "track-mbid": string
}

export const TrackRelatedValue = {
  medium: "medium",
  artists: "artists"
} as const

export type TrackRelated = ObjectValues<typeof TrackRelatedValue>

export const TrackRelatedType = {
  [TrackRelatedValue.medium]: ResourceTypeValue.medium,
  [TrackRelatedValue.artists]: ResourceTypeValue.artist
} as const

export type TrackResource = Resource<
  typeof ResourceTypeValue.track,
  TrackAttributes,
  TrackRelated,
  typeof TrackRelatedType
>
export type TrackDocument = Document<
  TrackRelated,
  typeof TrackRelatedType,
  TrackResource,
  MediumResource | ArtistResource
>
export type TracksDocument = MultiDocument<
  TrackRelated,
  typeof TrackRelatedType,
  TrackResource,
  MediumResource | ArtistResource
>
