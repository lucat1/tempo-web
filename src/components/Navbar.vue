<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// NOTE: these classes have to be safelisted in tailwind's config
const routes = computed(() => [
  { name: 'Home', to: '/', iconSolid: 'fluent--home-24-filled', iconOutline: 'fluent--home-24-regular', selected: route.name == 'Home' },
  { name: 'Search', to: '/search', iconSolid: 'fluent--search-16-filled', iconOutline: 'fluent--search-16-regular', selected: route.name == 'Search' },
  { name: 'Artists', to: '/artists', iconSolid: '', iconOutline: '', selected: route.name.includes('Artist') },
  { name: 'Releases', to: '/releases', iconSolid: '', iconOutline: '', selected: route.name.includes('Release') },
])
</script>

<template>
  <nav class="bg-neutral-focus rounded-xl p-2">
    <router-link v-for="route in routes" :to="route.to"
      class="flex flex-row items-center font-semibold rounded-xl my-1 p-2 px-4"
      :class="route.selected ? 'text-accent' : ''">
      <span :class="`icon-[${route.selected ? route.iconSolid : route.iconOutline}]`" class="w-7 h-7 mr-4" />
      {{ route.name }}
    </router-link>
  </nav>
  <nav class="bg-neutral-focus rounded-xl p-2 mt-2 flex-1">nav2</nav>
</template>
