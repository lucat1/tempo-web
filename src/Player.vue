<script setup lang="ts">
import formatDuration from 'format-duration';

import PlayButton from '@/components/player/PlayButton.vue'
import ArrowButton from '@/components/player/ArrowButton.vue'

import { usePlayer } from '@/stores/player'

const player = usePlayer()
</script>

<template>
  <section
    class="w-screen md:col-start2 md:col-end-4 md:row-start-2 md:row-end-3 overflow-auto flex items-center justify-center">
    <main class="h-full flex flex-col py-2 items-center">
      <div class="my-1 flex flex-row items-center">
        <ArrowButton :forward="false" :disabled="!player.canPlay" />
        <PlayButton :playing="false" :disabled="!player.canPlay" />
        <ArrowButton :forward="true" :disabled="!player.canPlay" />
      </div>
      <div class="my-1 flex flex-row items-center">
        <span class="mr-2 text-xs">{{ formatDuration(player.position) }}</span>
        <progress class="progress progress-primary min-h-0 h-1 w-96" :value="player.progress" max="1"></progress>
        <span class="ml-2 text-xs">{{ formatDuration(player.track?.attributes.duration || 0) }}</span>
      </div>
    </main>
  </section>
</template>
