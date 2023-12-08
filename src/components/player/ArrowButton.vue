<script setup lang="ts">
const { forward, disabled } = defineProps({ forward: Boolean, disabled: Boolean })
</script>

<template>
  <button :disabled="disabled" class="btn btn-smd btn-circle" :class="forward ? 'ml-4' : 'mr-4'">
    <span v-if="forward" class="w-6 h-6 icon-[eva--skip-forward-fill]" />
    <span v-else class="w-6 h-6 icon-[eva--skip-back-fill]" />
  </button>
</template>
