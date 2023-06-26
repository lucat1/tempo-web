<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeIcon as HomeSolid, MagnifyingGlassIcon as SearchSolid, UserIcon as ArtistsSolid, RectangleStackIcon as ReleasesSolid } from '@heroicons/vue/24/solid'
import { HomeIcon as HomeOutline, MagnifyingGlassIcon as SearchOutline, UserIcon as ArtistsOutline, RectangleStackIcon as ReleasesOutline } from '@heroicons/vue/24/outline'

const route = useRoute()

const routes = computed(() => [
  { name: 'Home', to: '/', iconSolid: HomeSolid, iconOutline: HomeOutline, selected: route.name == 'Home' },
  { name: 'Search', to: '/search', iconSolid: SearchSolid, iconOutline: SearchOutline, selected: route.name == 'Search' },
  { name: 'Artists', to: '/artists', iconSolid: ArtistsSolid, iconOutline: ArtistsOutline, selected: route.name.includes('Artist') },
  { name: 'Releases', to: '/releases', iconSolid: ReleasesSolid, iconOutline: ReleasesOutline, selected: route.name.includes('Release') },
])
</script>

<template>
  <nav class="bg-neutral rounded-xl p-2">
    <router-link v-for="route in routes" :to="route.to"
      class="flex flex-row items-center font-semibold rounded-xl my-1 p-2 px-4"
      :class="route.selected ? 'text-accent' : ''">
      <component :is="route.selected ? route.iconSolid : route.iconOutline" class="w-7 h-7 mr-4" />
      {{ route.name }}
    </router-link>
  </nav>
  <nav class="bg-neutral rounded-xl p-2 mt-2 flex-1">nav2</nav>
</template>
