<script setup lang="ts">
import { useServer } from '@/stores/server'

const server = useServer()
const token = await server.token()
</script>

<template>
  <div
    class="grid p-2 gap-2 w-screen h-screen grid-cols-layout-mobile grid-cols-rows-layout-mobile md:grid-cols-layout md:grid-rows-layout">
    <nav class="md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-3 bg-neutral rounded-xl">
    </nav>
    <main class="md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-2 bg-neutral-focus rounded-xl">
      <router-view></router-view>
    </main>
    <section class="md:col-start-2 md:col-end-4 md:row-start-2 md:row-end-3 bg-neutral rounded-xl">
    </section>
    <section class="md:col-start-3 md:col-end-4 md:row-start-1 md:row-end-2 bg-neutral-focus rounded-xl">
    </section>
  </div>
</template>
