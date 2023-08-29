export type ObjectValues<T> = T[keyof T]

export const ResourceTypeValue = {
  server: "server",
  auth: "auth",
  user: "user",

  artist: "artist",
  track: "track",
  release: "release",
  medium: "medium",
  image: "image",

  directory: "directory",
  import: "import",
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
  meta?: {
    join_phrase?: string
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
