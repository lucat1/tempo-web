<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from "@tanstack/vue-query";

import Avatar from '@/components/Avatar.vue'
import Release from '@/components/Release.vue'
import Dot from '@/components/Dot.vue'

import fetch from '@/fetch'
import { ARTIST_PATH } from '@/constants/tempo'
import type { ArtistDocument } from '@/types/tempo'

const { params: { id } } = useRoute()

const {
  data,
  suspense,
} = useQuery({
  queryKey: ['artists', id],
  queryFn: fetch<ArtistDocument>(ARTIST_PATH(id), { include: ['tracks', 'releases', 'releases.artists'] }),
})
await suspense()

const expanded = ref(false)
type DiscographyFilter = 'all' | 'albums' | 'singles'
const discography = ref<DiscographyFilter>('all')

const relationshipReleases = computed(() => data.value.data.relationships?.releases?.data || [])
const relationshipTracks = computed(() => data.value.data.relationships?.tracks?.data || [])

const releases = computed(() =>
  relationshipReleases.value.map(({ id, type }) => data.value.included.find(({ id: _id, type: _type }) => _id == id && _type == type))
)
const filteredReleases = computed(() => releases.value.filter(({ attributes }) => {
  switch (discography.value) {
    case 'all':
      return true;
    case 'albums':
      return attributes.release_type == 'album'
    case 'singles':
      return attributes.release_type == 'single'
  }
}))
</script>

<template>
  <main class="p-4 h-full overflow-auto flex flex-col">
    <section class="flex flex-row items-end p-2">
      <Avatar :artist="data.data" />
      <div class="flex flex-1 flex-col mx-6">
        <h1 class="text-3xl font-bold my-4">{{ data.data.attributes.name }}</h1>
        <div class="flex flex-row items-center">
          <template v-if="relationshipReleases">
            <span>{{ relationshipReleases.length }} release{{ relationshipReleases.length > 1 ?
              's' : '' }}</span>
            <Dot />
          </template>
          <span v-if="relationshipTracks">{{ relationshipTracks.length }} track{{ relationshipTracks.length > 1 ?
            's' : '' }}</span>
        </div>
      </div>
    </section>
    <section class="flex flex-col">
      <div class="overflow-hidden" :class="!expanded && 'h-32'">
        <p class="max-w-full prose" v-if="data.data.attributes.description" v-html="data.data.attributes.description">
        </p>
      </div>
      <a class="link my-2" @click="expanded = !expanded">{{ expanded ? 'Collapse' : 'Read more' }}</a>
    </section>
    <section class="flex flex-col my-4">
      <h2 class="text-xl font-bold">Discography</h2>
      <div class="flex flex-row my-4">
        <button class="btn btn-sm rounded-full mr-2" :class="discography == 'all' ? 'btn-primary' : 'btn-neutral'"
          @click="discography = 'all'">All
          releases</button>
        <button class="btn btn-sm rounded-full mx-2" :class="discography == 'albums' ? 'btn-primary' : 'btn-neutral'"
          @click="discography = 'albums'">Albums</button>
        <button class="btn btn-sm rounded-full mx-2" :class="discography == 'singles' ? 'btn-primary' : 'btn-neutral'"
          @click="discography = 'singles'">Singles</button>
      </div>
      <div class="flex flex-row flex-wrap">
        <Release v-for="release in filteredReleases" :key="release.id" :release="release" :included="data.included" />
      </div>
    </section>
  </main>
</template>
