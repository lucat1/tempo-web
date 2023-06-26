<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from "@tanstack/vue-query";

import Avatar from '@/components/Avatar.vue'
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
const tracks = computed(() => data.value.data.relationships?.tracks?.data)
const releases = computed(() => data.value.data.relationships?.releases?.data)
</script>

<template>
  <main class="p-4 h-full overflow-auto flex flex-col">
    <section class="flex flex-row items-end p-2">
      <Avatar :artist="data.data" />
      <div class="flex flex-1 flex-col mx-6">
        <h1 class="text-3xl font-bold my-4">{{ data.data.attributes.name }}</h1>
        <div class="flex flex-row items-center">
          <span v-if="releases">{{ releases.length }} releases</span>
          <Dot />
          <span v-if="tracks">{{ tracks.length }} tracks</span>
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
  </main>
</template>
