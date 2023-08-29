<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import { useQuery } from "@tanstack/vue-query";

import fetch, { fetchPut } from '@/fetch'
import router from '@/router'
import { DOWNLOADS_PATH, DOWNLOAD_PATH, IMPORTS_PATH } from '@/constants/internal'
import type { DirectoriesDocument, ImportDocument } from '@/types/internal'

const { params: { id } } = useRoute()

let {
  data: doc,
  suspense,
} = useQuery({
  queryKey: ['downloads', id],
  queryFn: fetch<DirectoriesDocument>(!id ? DOWNLOADS_PATH : DOWNLOAD_PATH(encodeURIComponent(id as string))),
})
await suspense()

const parent = computed(() => !!id ? (id as string).split('/').slice(0, -1).join('/') : undefined)
const directories = computed(() => {
  let relationships = doc.value.data.relationships?.directories?.data || []
  return relationships.map(({ id, type }) => {
    return doc.value.included.find(({ id: _id, type: _type }) => _id == id && _type == type) || {}
  })
})

const imprt = async (directory: string) => {
  const importDoc: ImportDocument = await fetchPut(IMPORTS_PATH, {
    data: {
      type: "import",
      attributes: { directory }
    }
  });
  console.log(importDoc.data.id)
  router.push({ name: 'Import', params: { id: importDoc.data.id } })
}
</script>

<template>
  <div class="overflow-x-auto">
    <table class="table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Size</th>
          <th>Import</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="parent != undefined">
          <td>
            <router-link class="link link-primary link-hover" :to="`/downloads/${parent}`">..</router-link>
          </td>
          <td>-</td>
          <td><button class="btn">Import</button></td>
        </tr>
        <tr v-for="dir in directories" :key="dir.id">
          <td>
            <router-link class="link link-primary link-hover" :to="`/downloads/${dir.id}`">{{
              dir.attributes.name
            }}</router-link>
          </td>
          <td>-</td>
          <td><button @click="imprt(dir.id)" class="btn">Import</button></td>
        </tr>
        <tr v-for="file in doc.data.attributes?.files" :key="file.path">
          <td>{{ file.name }}</td>
          <td>{{ file.size }}</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
