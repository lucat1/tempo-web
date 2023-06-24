<script setup lang="ts">
import { useServer } from '@/stores/server'
import { RELEASES_PATH } from '@/constants/tempo'

const server = useServer()
const token = await server.token()

const url = server.url(RELEASES_PATH)!
const res = await fetch(url, {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.api+json'
  },
})
const data = await res.json();
console.log(data)
</script>

<template>
  Releases
</template>
