<script setup lang="ts">
import { ref } from 'vue'

import Navbar from '@/components/Navbar.vue'

const sidebar = ref(false)
</script>

<template>
  <div
    class="grid p-2 gap-2 w-screen h-screen grid-cols-layout-mobile grid-cols-rows-layout-mobile md:grid-cols-layout md:grid-rows-layout">
    <section class="flex flex-col md:col-start-1 md:col-end-2 md:row-start-1 md:row-end-3 overflow-hidden">
      <Navbar />
    </section>
    <main class="md:col-start-2 md:col-end-3 md:row-start-1 md:row-end-2 bg-neutral-focus rounded-xl overflow-hidden"
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
    <section class="md:col-start-2 md:col-end-4 md:row-start-2 md:row-end-3 bg-neutral-focus rounded-xl overflow-hidden">
      <a @click="sidebar = !sidebar">show</a>
    </section>
    <section class="md:col-start-3 md:col-end-4 md:row-start-1 md:row-end-2 bg-neutral-focus rounded-xl overflow-hidden"
      :class="sidebar ? 'block' : 'hidden'">
    </section>
  </div>
</template>
