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

self.addEventListener("activate", async () => {
  console.log("Service worker activating");
  state = defaultState
  gotOneState = false
  const sleep = (time: number) => new Promise(r => setTimeout(r, time));
  while (!gotOneState) {
    channel.postMessage({ action: "requestState" })
    await sleep(500)
  }

  clients.claim();
  while (true) {
    channel.postMessage({ action: "requestState" })
    await sleep(1000 * 3 * 60) // update the state every 3 minutes
  }
});

self.addEventListener("fetch", function({ request: req, respondWith }) {
  const url = new URL(req.url)
  if (state.authenticated && state.token && url.host == state.host?.host) {
    req.headers.append('Authorization', `Bearer ${state.token}`)
  }
  respondWith(fetch(req))
})

