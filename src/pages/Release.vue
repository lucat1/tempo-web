<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useQuery } from "@tanstack/vue-query";

import Image from '@/components/Image.vue'
import ArtistNames from '@/components/ArtistNames.vue'

import fetch from '@/fetch'
import { RELEASE_PATH } from '@/constants/tempo'
import type { ReleaseDocument } from '@/types/tempo'

const { params: { id } } = useRoute()

const {
  data,
  suspense,
} = useQuery({
  queryKey: ['releases', id],
  queryFn: fetch<ReleaseDocument>(RELEASE_PATH(id), { include: ['mediums', 'mediums.tracks', 'mediums.tracks.artists', 'artists'] }),
})
await suspense()

const image = computed(() => data.value.data.relationships?.image?.data)
const relationshipArtists = computed(() => data.value.data.relationships?.artists?.data)
</script>

<template>
  <div class="avatar">
    <div class="w-32 lg:w-64 rounded-lg">
      <Image v-if="image" :id="image.id" />
    </div>
  </div>

  {{ data.data.attributes.title }}
  <ArtistNames v-if="relationshipArtists" :included="data.included" :artists="relationshipArtists" />
</template>
