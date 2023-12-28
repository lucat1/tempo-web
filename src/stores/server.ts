import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

import { AUTH_PATH, SERVER_PATH } from '@/constants/tempo'
import type { ServerResource, AuthResource } from '@/types/tempo'
import type { Message } from '@/types/service-worker'

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

const ONE_HOUR = 3_600_000

export const useServer = defineStore('server', {
  state: () => ({
    host: useLocalStorage<URL | null>('tempo/host', null),
    server: useLocalStorage<ServerResource | null>('tempo/server', null, options),
    auth: useLocalStorage<AuthResource | null>('tempo/auth', null, options),
  }),
  getters: {
    connected: ({ server }) => !!server,
    authenticated: ({ host, auth, server }) => {
      if (!auth) return false

      // we consider a user authenticated even if its token has expired, so long
      // as it can be renewd
      const expiry = new Date(auth.attributes.refresh.expires_at)
      return !!server && !!host && (new Date().getTime() - expiry.getTime() + ONE_HOUR) < 0
    },

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
    url(path: string): URL | null {
      if (!this.host) { return null }

      const url = new URL(this.host)
      url.pathname = path
      return url
    },

    async authenticate(data: AuthData): boolean {
      if (!this.connected || !this.host) return false

      const url = this.url(AUTH_PATH)!
      const req = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'Accept': 'application/vnd.api+json'
        }
      })
      const res = await req.json()
      this.auth = res.data
      return true
    },

    async token(): Promise<string> {
      if (!this.authenticated) {
        throw new Error("Invalid session, cannot get the auth token")
      }

      const expiry = new Date(this.auth.attributes.token.expires_at)
      const expiresInOneHour = new Date().getTime() - expiry.getTime() + ONE_HOUR > 0
      if (expiresInOneHour) {
        const url = this.url(AUTH_PATH)!
        const req = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.auth.attributes.refresh.value}`,
          }
        })
        const res = await req.json()
        this.auth = res.data
      }
      return this.auth.attributes.token.value
    },
  },
})

const workerChannel = new BroadcastChannel("sw")
export const monitor = () => {
  const store = useServer()

  const sendState = async () => {
    const host = store.url('/')
    workerChannel.postMessage({
      action: 'state', data: {
        authenticated: store.authenticated,
        host: host?.toString(),
        token: await store.token(),
      }
    })
  }

  workerChannel.addEventListener('message', ({ data }: { data: Message }) => {
    switch (data.action) {
      case 'requestState':
        sendState()
        break

      default:
        console.trace("Ignoring sw channel message", data)
    }
  })

  store.$subscribe(sendState, { detached: true })
}
