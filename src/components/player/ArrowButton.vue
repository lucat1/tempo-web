<script setup lang="ts">
import { ForwardIcon, BackwardIcon } from '@heroicons/vue/24/solid'

const { forward, disabled } = defineProps({ forward: Boolean, disabled: Boolean })
</script>

<template>
  <button :disabled="disabled" class="btn btn-smd btn-circle h-2 p-2 mx-2">
    <ForwardIcon v-if="forward" class="w-4 h-4" />
    <BackwardIcon v-else class="w-4 h-4" />
  </button>
</template>
