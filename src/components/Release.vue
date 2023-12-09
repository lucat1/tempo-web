<script setup lang="ts">
import { computed } from 'vue'

import Image from '@/components/Image.vue'
import ArtistNames from './ArtistNames.vue';
import type { ReleaseResource, ReleaseDocument } from '@/types/tempo'

const { release, included } = defineProps<{ release: ReleaseResource, included: ReleaseDocument.included }>()
const relationshipArtists = computed(() => release.relationships?.artists?.data)
</script>

<template>
  <router-link class="flex flex-col p-4 m-2 hover:bg-base-100 rounded-xl" :to="`/releases/${release.id}`">
    <div class="avatar">
      <div class="w-32 lg:w-48 rounded-lg">
        <Image v-if="release.relationships?.image?.data?.id" :id="release.relationships?.image?.data?.id" />
      </div>
    </div>
    <a class="mt-3 w-32 lg:w-48 font-semibold truncate text-ellipsis overflow-hidden">{{ release.attributes.title
    }}<span v-if="release.attributes.disambiguation"> ({{ release.attributes.disambiguation }})</span></a>
    <p class="mt-3 w-32 lg:w-48 font-semibold truncate text-ellipsis overflow-hidden">
      <ArtistNames :included="included" :artists="relationshipArtists" />
    </p>
  </router-link>
</template>
