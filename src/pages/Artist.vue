<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useQuery } from "@tanstack/vue-query";

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
</script>

<template>
  Artist {{ JSON.stringify($route.params) }}
</template>
