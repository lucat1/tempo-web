<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import { useQuery } from "@tanstack/vue-query";

import fetch from '@/fetch'
import { IMPORT_PATH } from '@/constants/internal'
import type { ImportDocument } from '@/types/internal'

const REFETCH_INTERVAL = 500; // milliseconds

const { params: { id } } = useRoute()

let {
  data: doc,
  suspense,
} = useQuery({
  queryKey: ['imports', id],
  queryFn: fetch<ImportDocument>(IMPORT_PATH(id as string)),
  refetchInterval: (data) => data?.data?.attributes?.cover_ratings?.length == 0 ? REFETCH_INTERVAL : false,
})
await suspense()

console.log(doc.value)
</script>

<template>
  <pre><code>{{ JSON.stringify(doc) }}</code></pre>
</template>
