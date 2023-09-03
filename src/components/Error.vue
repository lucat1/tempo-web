<script setup lang="ts">
import { Ref } from 'vue'

const { error } = defineProps(['error'])
</script>

<template>
  Oh no! An error has occourred: {{ error }}
</template>
