<script setup lang="ts">
import PlayButton from '@/components/player/PlayButton.vue'
import ArrowButton from '@/components/player/ArrowButton.vue'
</script>

<template>
  <section
    class="w-screen md:col-start2 md:col-end-4 md:row-start-2 md:row-end-3 overflow-auto flex items-center justify-center">
    <main class="h-full flex flex-col py-2 items-center">
      <div class="my-1 flex flex-row items-center">
        <ArrowButton :forward="false" :disabled="true" />
        <PlayButton :playing="false" :disabled="true" />
        <ArrowButton :forward="true" :disabled="true" />
      </div>
      <div class="my-1 flex flex-row items-center">
        <span class="mr-2 text-xs">1:23</span>
        <progress class="progress progress-primary min-h-0 h-1 w-96" value="50" max="100"></progress>
        <span class="ml-2 text-xs">3:12</span>
      </div>
    </main>
  </section>
</template>
