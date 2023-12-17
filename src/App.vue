<template>
  <div class="w-screen h-screen overflow-hidden grid">
    <Suspense>
      <router-view :key="$route.fullPath"></router-view>

      <template #fallback>
        <main class="flex w-screen h-screen items-center justify-center">
          <span class="loading loading-spinner loading-lg" />
        </main>
      </template>
    </Suspense>
  </div>
</template>
