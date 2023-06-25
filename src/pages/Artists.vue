<script setup lang="ts">
import { computed } from 'vue'
import { useInfiniteQuery } from "@tanstack/vue-query";

import Image from '@/components/Image.vue'

import { paginated } from '@/fetch'
import { ARTISTS_PATH } from '@/constants/tempo'
import type { ArtistsDocument } from '@/types/tempo'

const {
  data,
  suspense,
  fetchNextPage,
  hasNextPage,
} = useInfiniteQuery({
  queryKey: ['artists'],
  queryFn: paginated<ArtistsDocument>(ARTISTS_PATH, { include: ['images'], filter: { 'tracks': 'true' }, page: { size: 20 } }),
  getNextPageParam: (last: ArtistsDocument, _) => last.data.length > 0 ? last.data[last.data.length - 1].id : null
})
await suspense()

const imageForArtist = computed(() => data.value.pages.map(({ data }) => data.map(artist => artist.relationships?.images?.data[0])))
</script>

<template>
  <main class="h-full overflow-auto">
    <div v-for="page, i in data.pages">
      Page {{ i }}
      <template v-for="artist, j in page.data" :key="artist.id">
        <div>
          {{ artist.attributes.name }}
          <Image :id="imageForArtist[i][j].id" v-if="imageForArtist[i][j]" :key="imageForArtist[i][j].id" />
        </div>
        <div class="divider" />
      </template>
      <button @click="fetchNextPage" v-if="hasNextPage">next</button>
    </div>
  </main>
</template>
