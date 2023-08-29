import type { ObjectValues, Resource, Document, MultiDocument } from './jsonapi'
import { ResourceTypeValue } from './jsonapi'
import { ArtistResource, MediumResource, ReleaseResource, TrackResource } from './tempo'

export interface DirectoryAttributes {
  id: string
  name: string
  path: string
  files: FileEntry[]
}

export interface FileEntry {
  name: string
  path: string
  size: number
}

export const DirectoryRelatedValue = {
  directories: "directories",
} as const

export type DirectoryRelated = ObjectValues<typeof DirectoryRelatedValue>

export const DirectoryRelatedType = {
  [DirectoryRelatedValue.directories]: ResourceTypeValue.directories,
} as const

export type DirectoryResource = Resource<
  typeof ResourceTypeValue.directory,
  DirectoryAttributes,
  DirectoryRelated,
  typeof DirectoryRelatedType
>
export type DirectoryDocument = Document<
  DirectoryRelated,
  typeof DirectoryRelatedType,
  DirectoryResource,
  DirectoryResource
>
export type DirectoriesDocument = MultiDocument<
  DirectoryRelated,
  typeof DirectoryRelatedType,
  DirectoryResource,
  DirectoryResource
>

export interface ImportAttributes {
  id: string
}

export const ImportRelatedValue = {
  releases: "releases",
  mediums: "mediums",
  tracks: "tracks",
  artists: "artists",
} as const

export type ImportRelated = ObjectValues<typeof ImportRelatedValue>

export const ImportRelatedType = {
  [ImportRelatedValue.releases]: ResourceTypeValue.release,
  [ImportRelatedValue.mediums]: ResourceTypeValue.medium,
  [ImportRelatedValue.tracks]: ResourceTypeValue.track,
  [ImportRelatedValue.artists]: ResourceTypeValue.artist,
} as const

export type ImportResource = Resource<
  typeof ResourceTypeValue.import,
  ImportAttributes,
  ImportRelated,
  typeof ImportRelatedType
>
export type ImportDocument = Document<
  ImportRelated,
  typeof ImportRelatedType,
  ImportResource,
  ReleaseResource | MediumResource | TrackResource | ArtistResource
>
export type ImportsDocument = MultiDocument<
  ImportRelated,
  typeof ImportRelatedType,
  ImportResource,
  ReleaseResource | MediumResource | TrackResource | ArtistResource
>
