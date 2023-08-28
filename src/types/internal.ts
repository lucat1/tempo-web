import type { ObjectValues, Resource, Document, MultiDocument } from './jsonapi'
import { ResourceTypeValue } from './jsonapi'

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
  typeof ResourceTypeValue.track,
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
  directories: "directories",
} as const

export type ImportRelated = ObjectValues<typeof ImportRelatedValue>

export const ImportRelatedType = {
  [ImportRelatedValue.directories]: ResourceTypeValue.directories,
} as const

export type ImportResource = Resource<
  typeof ResourceTypeValue.track,
  ImportAttributes,
  ImportRelated,
  typeof ImportRelatedType
>
export type ImportDocument = Document<
  ImportRelated,
  typeof ImportRelatedType,
  ImportResource,
  ImportResource
>
export type ImportsDocument = MultiDocument<
  ImportRelated,
  typeof ImportRelatedType,
  ImportResource,
  ImportResource
>
