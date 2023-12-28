/// <reference no-default-lib="true"/>
/// <reference lib="ES2015" />
/// <reference lib="webworker" />

declare var self: ServiceWorkerGlobalScope;
import type { State, Message } from "@/types/service-worker"

let gotOneState = false
const defaultState: State = {
  authenticated: false,
  host: null,
  token: null
}
let state = defaultState

const channel = new BroadcastChannel("sw")

channel.addEventListener("message", ({ data }: { data: Message }) => {
  console.log(data)
  switch (data.action) {
    case "state":
      gotOneState = true
      const d = data.data as State
      state = {
        authenticated: d.authenticated,
        host: new URL(d.host),
        token: d.token
      }
      console.log("Updated state", state)
      break

    default:
      console.trace("Ignoring sw channel message", data)
  }
})

const sleep = (time: number) => new Promise(r => setTimeout(r, time));

self.addEventListener("activate", async () => {
  console.log("Service worker activating");
  state = defaultState
  gotOneState = false
  while (!gotOneState) {
    channel.postMessage({ action: "requestState" })
    await sleep(500)
  }

  clients.claim();
});

self.addEventListener("fetch", function(event) {
  const url = new URL(event.request.url)
  console.log("checking", state.authenticated, !!state.token, url.host == state.host?.host)
  if (state.authenticated && !!state.token && url.host == state.host?.host) {
    console.log("Appending authorization header", event.request.method, event.request.url)
    const req = new Request(event.request, {
      method: event.request.method,
      headers: { ...event.request.headers, 'Authorization': `Bearer ${state.token}` },
      mode: "cors"
    })
    event.respondWith(fetch(req))
    return fetch(req)
  } else {
    console.log("Ignoring", event.request.url)
    event.respondWith(fetch(event.request))
    return fetch(event.request)
  }
})

  ; (async () => {
    while (true) {
      channel.postMessage({ action: "requestState" })
      await sleep(1000 * 3 * 60) // update the state every 3 minutes
    }
  })()
