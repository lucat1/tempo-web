<script setup lang="ts">
import { IMAGE_FILE_PATH } from '@/constants/tempo'
import { authenticatedURL } from '@/fetch'

const props = defineProps({
  id: String,
})
const url = await authenticatedURL(IMAGE_FILE_PATH(props.id))
</script>

<template>
  <img :src="url" />
</template>
