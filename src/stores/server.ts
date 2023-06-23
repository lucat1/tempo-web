import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

import { SERVER_PATH } from '@/constants/tempo'
import type { ServerResource, AuthResource } from '@/types/tempo'
import { AUTH_PATH } from '../constants/tempo'

interface AuthData {
  username: string
  password: string
}

const options = {
  serializer: {
    read: (v: any) => v ? JSON.parse(v) : null,
    write: (v: any) => JSON.stringify(v),
  },
}


export const useServer = defineStore('server', {
  state: () => ({
    host: useLocalStorage<URL | null>('tempo/host', null),
    server: useLocalStorage<ServerResource | null>('tempo/server', null, options),
    auth: useLocalStorage<AuthResource | null>('tempo/auth', null, options),
  }),
  getters: {
    connected: ({ server }) => !!server,
    // TODO: take care of expiry
    authenticated: ({ auth }) => !!auth,

    attributes: ({ server }) => server.attributes,
    features: ({ server }) => server.attributes.features,
    authRequired: ({ server }) => server ? server.attributes.auth_required : false
  },
  actions: {
    forget() {
      this.server = null
    },
    async connect(url: URL): Promise<boolean> {
      this.server = null
      try {
        this.host = new URL(url)
        this.host.pathname = ''

        url.pathname = SERVER_PATH
        const req = await fetch(url)
        this.server = (await req.json()).data
        return true
      } catch (e) {
        return false
      }
    },
    logout() {
      this.auth = null
    },
    async authenticate(data: AuthData): boolean {
      if (!this.connected || !this.host) return false

      const url = new URL(this.host)
      url.pathname = AUTH_PATH

      const req = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const res = await req.json()
      this.auth = res.data
      return true
    },
  },
})
