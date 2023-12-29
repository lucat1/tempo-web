import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { ref } from 'vue'
import { Gapless5 } from '@regosen/gapless-5'

import { useServer } from '@/stores/server'
import { TRACK_AUDIO_PATH } from '@/constants/tempo'
import { authenticatedURL } from '@/fetch'
import type { TrackResource } from '@/types/tempo'
import type { ObjectValues } from '@/types//jsonapi'

export const PlayerStateValue = {
  loading: "loading",
  playing: "playing",
  paused: "paused",
}
export type PlayerState = ObjectValues<typeof PlayerStateValue>

export const usePlayer = defineStore('player', {
  state: () => {
    const position = ref(0)
    const volume = useLocalStorage<number>('tempo/player/volume', 0.5)
    const tracks = ref<TrackResource[]>([])
    const current = ref<number | null>(null)
    const state = ref<PlayerState>(PlayerStateValue.paused)

    const gapless = new Gapless5({ fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => { console.log("CUSTOM FETCH", input); return fetch(input, init) } })
    gapless.ontimeupdate = (time) => position.value = time
    gapless.onloadstart = _ => state.value = PlayerStateValue.loading
    gapless.onload = _ => state.value = PlayerStateValue.playing
    gapless.onpause = _ => state.value = PlayerStateValue.paused
    gapless.onplay = _ => state.value = PlayerStateValue.playing
    gapless.onstop = _ => state.value = PlayerStateValue.paused
    gapless.onprev = _ => position.value++
    gapless.onprev = _ => position.value--
    gapless.setVolume(volume.value)
    // TODO: handle loading errors

    return {
      _gapless5: gapless,
      state,
      tracks,
      current,
      position,
      volume
    }
  },
  getters: {
    isTrackLoaded(): boolean {
      return this.current != null
    },
    canPrev(): boolean {
      return this.isTrackLoaded && this.current! > 0
    },
    canPlay(): boolean {
      return this.isTrackLoaded
    },
    canNext(): boolean {
      return this.isTrackLoaded && this.current! < this.tracks.length - 1
    },
    queue(): TrackResource[] {
      return this.tracks.slice(this.current || 0)
    },
    track(): TrackResource | null {
      if (!this.isTrackLoaded) {
        return null
      }

      const res = this.tracks[this.current!]
      console.log(res)
      return res
    },
    seekable(): number {
      return this._gapless5.getSeekablePercent() || 0
    },
    duration(): number {
      return this.track?.attributes?.duration || 0
    },
    progress(): number {
      if (!this.isTrackLoaded) {
        return 0
      } else {
        return this.position / Math.max(this.duration, 1)
      }
    }
  },
  actions: {
    clearQueue() {
      this._gapless5.removeAllTracks(true)
      this.tracks = []
    },
    async appendQueue(tracks: TrackResource[]) {
      for (const track of tracks) {
        const url = (await authenticatedURL(TRACK_AUDIO_PATH(track.id))).toString()
        this._gapless5.addTrack(url)
        this.tracks.push(track)
      }
    },
    async play(tracks: TrackResource[], index = 0) {
      this.clearQueue()
      await this.appendQueue(tracks)
      this.current = index
      this._gapless5.gotoTrack(index)
      this._gapless5.play()
    },

    prev() {
      this._gapless5.prev()
    },
    playpause() {
      this._gapless5.playpause()
    },
    next() {
      this._gapless5.next()
    }
  },
})
