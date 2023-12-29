<script setup lang="ts">
import { computed } from 'vue'

import type { ArtistResource, Relation, ResourceTypeValue } from '@/types/tempo'


const { artists: relationshipArtists, included, musicbrainz } = defineProps<{ artists: Relation<ResourceTypeValue.artist>, included: ArtistResource[], musicbrainz?: boolean }>()
const artists = computed(() =>
  relationshipArtists.map(({ id, type, meta }) => {
    let obj = included.find(({ id: _id, type: _type }) => _id == id && _type == type) || {}
    return { ...obj, meta }
  })
)
</script>

<template>
  <template v-for="artist in artists">
    <router-link v-if="!musicbrainz" class="link link-primary link-hover" :to="`/artists/${artist.id}`">{{
      artist.attributes.name
    }}</router-link>
    <a v-else class="link link-primary" target="_blank" :href="`https://musicbrainz.org/artist/${artist.id}`">{{
      artist.attributes.name
    }}</a>{{ artist.meta.join_phrase }}
  </template>
</template>
