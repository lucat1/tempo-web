<script setup lang="ts">
import { computed } from 'vue'

import type { ArtistResource, Relation, ResourceTypeValue } from '@/types/tempo'


const { artists: relationshipArtists, included } = defineProps<{ artists: Relation<ResourceTypeValue.artist>, included: ArtistResource[] }>()
const artists = computed(() =>
  relationshipArtists.map(({ id, type, meta }) => {
    let obj = included.find(({ id: _id, type: _type }) => _id == id && _type == type) || {}
    return { ...obj, meta }
  })
)
</script>

<template>
  <template v-for="artist in artists">
    {{ artist.meta.join_phrase }}
    <router-link class="link link-primary link-hover" :to="`/artists/${artist.id}`">{{
      artist.attributes.name
    }}</router-link>
  </template>
</template>
