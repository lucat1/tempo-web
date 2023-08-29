export const INTERNAL_PATH = "/internal"
export const DOWNLOADS_PATH = `${INTERNAL_PATH}/downloads`
export const IMPORTS_PATH = `${INTERNAL_PATH}/imports`

export const DOWNLOAD_PATH = (folder: string) => `${DOWNLOADS_PATH}/${folder}`
export const IMPORT_PATH = (id: string) => `${IMPORTS_PATH}/${id}`
