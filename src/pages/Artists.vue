<script setup lang="ts">
import { computed } from 'vue'
import { useInfiniteQuery } from "@tanstack/vue-query";

import Avatar from '@/components/Avatar.vue'

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
  queryFn: paginated<ArtistsDocument>(ARTISTS_PATH, { filter: { 'tracks': 'true' }, page: { size: 20 } }),
  getNextPageParam: (last: ArtistsDocument, _) => last.data.length > 0 ? last.data[last.data.length - 1].id : null
})
await suspense()
</script>

<template>
  <main class="h-full overflow-auto flex flex-wrap">
    <template v-for="page, i in data.pages">
      <template v-for="artist, j in page.data" :key="artist.id">
        <router-link class="block w-32 lg:w-64 mx-8 my-4 flex-shrink-0" :to="`artists/${artist.id}`">
          <Avatar :artist="artist" />
          <p class="link">{{ artist.attributes.name }}</p>
        </router-link>
      </template>
      <button @click="fetchNextPage" v-if="hasNextPage">next</button>
    </template>
  </main>
</template>
