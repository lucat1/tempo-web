<script setup lang="ts">
import { fillUrl } from '@/fetch'
import { useServer } from '@/stores/server'
import { IMAGE_FILE_PATH } from '@/constants/tempo'

const props = defineProps({
  id: String,
})
const urlPath = IMAGE_FILE_PATH(props.id)
const server = useServer()
const url = fillUrl(server.url(urlPath), {})
</script>

<template>
  <img :src="url" />
</template>
