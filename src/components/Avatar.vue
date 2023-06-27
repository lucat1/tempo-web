<script setup lang="ts">
import { computed } from 'vue'

import Image from '@/components/Image.vue'
import type { ArtistResource } from '@/types/tempo'

const props = defineProps<{ artist: ArtistResource }>()

const image = computed(() => props.artist.relationships?.images?.data[0])
</script>

<template>
  <div class="avatar" :class="!image && 'placeholder'">
    <div class="w-32 lg:w-64 rounded-lg" :class="!image && 'bg-accent text-neutral-content'">
      <Image v-if="image" :id="image.id" />
      <span v-else class="text-3xl">{{ artist.attributes.name[0] }}</span>
    </div>
  </div>
</template>
