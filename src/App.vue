<script setup lang="ts">
import Player from '@/Player.vue'
</script>

<template>
  <div class="w-screen h-screen overflow-hidden grid grid-cols-1 grid-rows-app">
    <Suspense>
      <router-view :key="$route.fullPath"></router-view>

      <template #fallback>
        <main class="flex w-screen h-screen items-center justify-center">
          <span class="loading loading-spinner loading-lg" />
        </main>
      </template>
    </Suspense>
    <Player />
  </div>
</template>
