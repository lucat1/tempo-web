import type { ObjectValues } from './jsonapi'

export const ActionValue = {
  requestState: "requestState",
  state: "state"
}
export type Action = ObjectValues<typeof ActionValue>

interface State {
  authenticated: boolean,
  host: URL | null
  token: String | null
}

export interface Message {
  action: Action
  data: State | null
}
