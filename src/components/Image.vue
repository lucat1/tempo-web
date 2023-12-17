<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

import { fetchBlob } from '@/fetch'
import { IMAGE_FILE_PATH } from '@/constants/tempo'

const props = defineProps({
  id: String,
})
const { data, suspense } = useQuery(['images', props.id], fetchBlob(IMAGE_FILE_PATH(props.id)), {
  cacheTime: 1000 * 60 * 60, // 60 minutes
  staleTime: 1000 * 60 * 30, // 30 minutes
})
await suspense()
const url = URL.createObjectURL(data.value)
</script>

<template>
  <img :src="url" />
</template>
