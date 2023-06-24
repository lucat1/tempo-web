<script setup lang="ts">
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
  queryFn: paginated<ArtistsDocument>(ARTISTS_PATH, { include: ['images'], page: { size: 20 } }),
  getNextPageParam: (last: ArtistsDocument, _) => last.data.length > 0 ? last.data[last.data.length - 1].id : null
})
await suspense()
</script>

<template>
  <main class="h-full overflow-auto">
    <div v-for="page, i in data.pages">
      Page {{ i }}
      <template v-for="artist in page.data" :key="artist.id">
        <template v-if="artist.relationships?.releases?.data?.length > 0">
          <div>
            {{ artist.attributes.name }}
            {{ artist.attributes.description || "No description" }}
            <Image :id="img.id" v-for="img in artist.relationships?.images?.data" :key="img.id" />
          </div>
          <div class="divider" />
        </template>
      </template>
      <button @click="fetchNextPage" v-if="hasNextPage">next</button>
    </div>
  </main>
</template>
