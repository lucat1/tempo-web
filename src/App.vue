<template>
  <div class="w-screen h-screen flex">
    <Suspense>
      <router-view></router-view>

      <!-- TODO spinner -->
      <template #fallback>
        <main class="flex w-screen h-screen items-center justify-center">
          <span class="loading loading-spinner loading-lg" />
        </main>
      </template>
    </Suspense>
  </div>
</template>
