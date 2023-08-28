import { useServer } from '@/stores/server'

export interface TempoQuery {
  include?: string[]
  sort?: string[]
  filter?: {
    [k: string]: any
  }
  page?: {
    after?: string
    before?: string
    size?: number
  }
}

type Fetch<T> = () => Promise<T>

const fillUrl = (base: URL, query: TempoQuery): URL => {
  const params: { [key: string]: string } = {}
  if (query.include) {
    params.include = query.include.join(',')
  }
  if (query.sort) {
    params.sort = query.sort.join(',')
  }
  if (query.filter) {
    for (const [key, value] of Object.entries(query.filter)) {
      if (value)
        params[`filter[${key}]`] = value
    }
  }
  if (query.page) {
    for (const [key, value] of Object.entries(query.page)) {
      if (value)
        params[`page[${key}]`] = value.toString()
    }
  }
  base.search = new URLSearchParams(params).toString()
    .replaceAll('%5B', '[') // [
    .replaceAll('%5D', ']') // ]
  return base
}

const fetchJson = <T>(path: String, query: TempoQuery = {}, method = 'GET'): Fetch<T> => {
  const server = useServer()
  const url = fillUrl(server.url(path), query)

  return async (): Promise<T> => {
    const token = await server.token()
    const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` } });
    const json: T = await res.json()
    return json
  }
}

type PaginatedFetch<T> = (page: { pageParam: any }) => Promise<T>

export const paginated = <T>(path: String, query: TempoQuery = {}, method = 'GET'): PaginatedFetch<T> => {
  return ({ pageParam }): Promise<T> => {
    const nextQuery = { ...query, page: { ...query.page, after: pageParam } }
    return fetchJson<T>(path, nextQuery, method)()
  }
}

export const fetchBlob = (path: String, query: TempoQuery = {}, method = 'GET'): Fetch<Blob> => {
  const server = useServer()
  const url = fillUrl(server.url(path), query)

  return async (): Promise<Blob> => {
    const token = await server.token()
    const res = await fetch(url, { method, headers: { 'Authorization': `Bearer ${token}` } });
    return res.blob()
  }
}

export const fetchPut = async <T, B>(path: String, body: B): Promise<T> => {
  const server = useServer()

  const token = await server.token()
  const res = await fetch(server.url(path), {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  const json: T = await res.json()
  return json
}

export default fetchJson
