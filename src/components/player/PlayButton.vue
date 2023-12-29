<script setup lang="ts">
const { playing, disabled } = defineProps({ playing: Boolean, disabled: Boolean })
</script>

<template>
  <button :disabled="disabled" class="btn btn-smd btn-circle btn-primary disabled:bg-neutral mx-2">
    <span v-if="playing" class="w-6 h-6 icon-[mdi--pause]" />
    <span v-else class="w-6 h-6 icon-[mdi--play]" />
  </button>
</template>
