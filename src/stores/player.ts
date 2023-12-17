import { defineStore } from 'pinia'
import { Gapless5 } from '@regosen/gapless-5'

import { useServer } from '@/stores/server'
import { TRACK_AUDIO_PATH } from '@/constants/tempo'
import type { TrackResource } from '@/types/tempo'

export const usePlayer = defineStore('player', {
  state: () => ({
    _gapless5: new Gapless5({
      fetch: (input: RequestInfo | URL, init?: RequestInit | undefined) => { console.log("CUSTOM FETCH", input); return fetch(input, init) }
    }),
    _tracks: new Map<string, TrackResource>()
  }),
  getters: {
    isTrackLoaded(): boolean {
      return this._gapless5.getTrack() != ''
    },
    canPlay(): boolean {
      return this.isTrackLoaded
    },
    track(): TrackResource | null {
      if (!this.isTrackLoaded) {
        return null
      }

      const key = this._gapless5.getTrack()
      return this._tracks.get(key)
    },
    position(): number {
      return this._gapless5.getPosition() || 0
    },
    seekable(): number {
      return this._gapless5.getSeekablePercent() || 0
    },
    progress(): number {
      return this.track ? this.position / this.track.attributes.duration : 0
    }
  },
  actions: {
    appendQueue(tracks: TrackResource[]) {
      const server = useServer()
      for (const track of tracks) {
        const url = server.url(TRACK_AUDIO_PATH(track.id), {}).toString()
        this._gapless5.addTrack(url)
        this._tracks.set(url, track)
      }
    },
    play(tracks: TrackResource[]) {
      this._gapless5.removeAllTracks(true)
      this.appendQueue(tracks)
      this._gapless5.play()
    }
  },
})
