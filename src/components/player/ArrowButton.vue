<script setup lang="ts">
import { ForwardIcon, BackwardIcon } from '@heroicons/vue/24/solid'

const { forward, disabled } = defineProps({ forward: Boolean, disabled: Boolean })
</script>

<template>
  <button :disabled="disabled" class="btn btn-smd btn-circle h-2 btn-primary p-2 disabled:bg-neutral mx-2">
    <ForwardIcon v-if="forward" class="w-5 h-5" />
    <BackwardIcon v-else class="w-5 h-5" />
  </button>
</template>
