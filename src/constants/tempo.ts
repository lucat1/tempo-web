export const BASE_PATH = "/tempo"
export const SERVER_PATH = `${BASE_PATH}/server`
export const AUTH_PATH = `${BASE_PATH}/auth`

export const ARTISTS_PATH = `${BASE_PATH}/artists`
export const RELEASES_PATH = `${BASE_PATH}/releases`
export const IMAGES_PATH = `${BASE_PATH}/images`
export const TRACKS_PATH = `${BASE_PATH}/tracks`

export const ARTIST_PATH = (id: string) => `${ARTISTS_PATH}/${id}`
export const RELEASE_PATH = (id: string) => `${RELEASES_PATH}/${id}`
export const IMAGE_PATH = (id: string) => `${IMAGES_PATH}/${id}`
export const IMAGE_FILE_PATH = (id: string) => `${IMAGES_PATH}/${id}/file`
export const TRACK_PATH = (id: string) => `${TRACKS_PATH}/${id}`
export const TRACK_AUDIO_PATH = (id: string) => `${TRACKS_PATH}/${id}/audio`
