<script setup lang="ts">
import { PauseIcon, PlayIcon } from '@heroicons/vue/24/solid'

const { playing, disabled } = defineProps({ playing: Boolean, disabled: Boolean })
</script>

<template>
  <button :disabled="disabled" class="btn btn-smd btn-circle h-2 btn-primary p-2 disabled:bg-neutral mx-2">
    <PauseIcon v-if="playing" class="w-4 h-4" />
    <PlayIcon v-else class="w-4 h-4" />
  </button>
</template>
