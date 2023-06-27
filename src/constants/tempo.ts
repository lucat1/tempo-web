export const BASE_PATH = "/tempo"
export const SERVER_PATH = `${BASE_PATH}/server`
export const AUTH_PATH = `${BASE_PATH}/auth`

export const ARTISTS_PATH = `${BASE_PATH}/artists`
export const RELEASES_PATH = `${BASE_PATH}/releases`
export const IMAGES_PATH = `${BASE_PATH}/images`

export const ARTIST_PATH = (id: string) => `${BASE_PATH}/artists/${id}`
export const RELEASE_PATH = (id: string) => `${BASE_PATH}/releases/${id}`
