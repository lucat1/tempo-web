<script setup lang="ts">
import { ref } from 'vue'

import Navbar from '@/components/Navbar.vue'
import Player from '@/Player.vue'

const sidebar = ref(false)
</script>

<template>
  <main class="w-screen h-screen overflow-hidden grid grid-cols-1 grid-rows-app">
    <div class="grid pt-2 px-2 gap-2 w-screen grid-cols-layout-mobile grid-cols-rows-layout-mobile md:grid-cols-layout">
      <section class="flex flex-col md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-3 overflow-auto">
        <Navbar />
      </section>
      <main class="md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-3 bg-neutral-focus rounded-xl overflow-auto"
        :class="!sidebar && 'md:col-end-4'">
        <Suspense>
          <router-view></router-view>

          <!-- TODO spinner -->
          <template #fallback>
            <main class="flex w-screen h-screen items-center justify-center">
              <span class="loading loading-spinner loading-lg" />
            </main>
          </template>
        </Suspense>
      </main>
      <section class="md:col-start-3 md:col-end-4 md:row-start-1 md:row-end-2 bg-neutral-focus rounded-xl overflow-auto"
        :class="sidebar ? 'block' : 'hidden'">
      </section>
    </div>
    <Player />
  </main>
</template>
