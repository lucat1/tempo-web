<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from "@tanstack/vue-query";
import formatDuration from 'format-duration'

import Image from '@/components/Image.vue'
import Dot from '@/components/Dot.vue'
import ArtistNames from '@/components/ArtistNames.vue'

import fetch from '@/fetch'
import { usePlayer } from '@/stores/player'
import { RELEASE_PATH } from '@/constants/tempo'
import type { ReleaseDocument, TrackResource } from '@/types/tempo'

const { params: { id } } = useRoute()
const player = usePlayer()

const {
  data,
  suspense,
} = useQuery({
  queryKey: ['releases', id],
  queryFn: fetch<ReleaseDocument>(RELEASE_PATH(id), { include: ['artists', 'genres', 'mediums', 'mediums.tracks', 'mediums.tracks.artists', 'mediums.tracks.genres'] }),
})
await suspense()

const image = computed(() => data.value.data.relationships?.image?.data)
const relationshipArtists = computed(() => data.value.data.relationships?.artists?.data)
const relationshipMediums = computed(() => data.value.data.relationships?.mediums?.data || [])
const mediums = computed(() =>
  relationshipMediums.value.map(({ id, type }) => data.value.included.find(({ id: _id, type: _type }) => _id == id && _type == type))
)
const relationshipTracksByMedium = computed(() => mediums.value.map(medium => medium.relationships?.tracks?.data || []))
const relationshipTracks = computed(() => mediums.value.map(medium => medium.relationships?.tracks?.data || []).flat())
const tracksByMedium = computed(() =>
  relationshipTracksByMedium.value.map(tracks => {
    return tracks.map(({ id, type }) => data.value.included.find(({ id: _id, type: _type }) => _id == id && _type == type)).sort((t1, t2) => t1.attributes.track > t2.attributes.track)
  })
)
const tracks = computed(() =>
  relationshipTracks.value.map(({ id, type }) => data.value.included.find(({ id: _id, type: _type }) => _id == id && _type == type))
)
const duration = computed(() => tracks.value.reduce((counter, track) => counter + track.attributes.duration, 0))

const play = (track: TrackResource) => {
  player.play([track])
}
</script>

<template>
  <main class="p-4 h-full overflow-auto flex flex-col">
    <section class="flex">
      <div class="avatar">
        <div class="w-32 lg:w-64 rounded-lg">
          <Image v-if="image" :id="image.id" />
        </div>
      </div>

      <div class="flex flex-1 flex-col mx-6">
        <h1 class="text-3xl font-bold my-4">
          {{ data.data.attributes.title }}
          <span v-if="data.data.attributes.disambiguation">({{ data.data.attributes.disambiguation }})</span>
        </h1>
        <span class="text-xl">
          <ArtistNames v-if="relationshipArtists" :included="data.included" :artists="relationshipArtists" />
        </span>
        <div class="flex flex-row items-center my-4">
          <span>{{ relationshipMediums.length }} disc{{ relationshipMediums.length > 1 ?
            's' : '' }}</span>
          <Dot />
          <span>{{ relationshipTracks.length }} track{{ relationshipTracks.length > 1 ?
            's' : '' }}</span>
          <Dot />
          <span>{{ formatDuration(duration) }}</span>
        </div>
      </div>
    </section>
    <table class="table table-pin-rows my-4">
      <template v-for="medium, i in mediums">
        <thead>
          <tr>
            <th></th>
            <th>Disc {{ i + 1 }}</th>
            <th></th>
            <th></th>
            <th></th>
          </tr>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>
              <span class="w-4 h-4 icon-[eva--heart-outline]" />
            </th>
            <th>Artists</th>
            <th>Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr class="hover:bg-base-100" v-for="track in tracksByMedium[i]" @click="play(track)">
            <th>{{ track.attributes.track }}</th>
            <td class="truncate">{{ track.attributes.title }}</td>
            <td>
              <span class="w-4 h-4 icon-[eva--heart-outline]" />
            </td>
            <td class="truncate">
              <ArtistNames v-if="track.relationships?.artists?.data" :included="data.included"
                :artists="track.relationships?.artists?.data" />
            </td>
            <td>{{ formatDuration(track.attributes.duration || 0) }}</td>
          </tr>
        </tbody>
      </template>
    </table>
  </main>
</template>
