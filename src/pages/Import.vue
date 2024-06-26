<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router'
import { useQuery, useMutation } from "@tanstack/vue-query";

import Error from '@/components/Error.vue'
import Loader from '@/components/Loader.vue'
import ArtistNames from '@/components/ArtistNames.vue'

import fetch, { fetchMethod } from '@/fetch'
import { IMPORT_PATH } from '@/constants/internal'
import type { ImportDocument, Cover } from '@/types/internal'
import type { ReleaseResource } from '@/types/tempo'

const REFETCH_INTERVAL = 500; // milliseconds

const { params: { id } } = useRoute()

const {
  isLoading, isError, data: doc, error
} = useQuery({
  queryKey: ['imports', id],
  queryFn: fetch<ImportDocument>(IMPORT_PATH(id as string)),
  refetchInterval: (data) => data?.data?.attributes?.cover_ratings?.length == 0 ? REFETCH_INTERVAL : false,
})

const { isMutationLoading, isMutationError, mutationError, isMutationSuccess, mutate } = useMutation({
  mutationFn: ({ kind, value }: { kind: 'selected_release' | 'selected_cover', value: number | string }) =>
    fetchMethod<ImportDocument>('PATCH', IMPORT_PATH(id as string), {
      data: {
        type: "import",
        id,
        attributes: { [kind]: value },
      }
    })
})

const selectedCoverId = computed(() => doc.value.data.attributes?.selected_cover)
const selectedCover = computed(() => selectedCoverId.value != undefined ?
  (doc.value.data.attributes.covers[selectedCoverId.value] || null) : null)

const covers = computed(() => doc.value?.data.attributes.covers || [])

const selectCover = (event: Event) => {
  mutate({ kind: 'selected_cover', value: event.target.selectedIndex })
}

const coverTitle = (cover: Cover) => {
  return `${cover.artist} - ${cover.title} (${cover.width}x${cover.height}, ${cover.provider})`
}

const sourceRelease = computed(() => doc.value.data.attributes.source_release)
const sourceTracks = computed(() => doc.value.data.attributes.source_tracks)

const releases = computed(() => doc.value?.included.filter(({ type, id }) => type == 'release') || [])
const selectedReleaseId = computed(() => doc.value.data.attributes?.selected_release)
const selectedRelease = computed(() => selectedReleaseId.value && releases.value ?
  (releases.value.find(({ id }) => id == selectedReleaseId.value) || null) : null)
const selectedReleaseArtists = computed(() => selectedRelease.value ? selectedRelease.value.relationships?.artists?.data || [] : [])
const selectedReleaseMediumIds = computed(() => selectedRelease.value ? selectedRelease.value.relationships?.mediums?.data.map(({ id }) => id) || [] : [])
const selectedReleaseMediums = computed(() => doc?.value.included.filter(({ type, id }) => type == 'medium' && selectedReleaseMediumIds.value.includes(id)))

const releaseTitle = (release: ReleaseResource) => {
  return `${release.attributes.title} (${release.id})`
}

const selectRelease = (event: Event) => {
  const index = event.target!.selectedIndex;
  const element = event.target!.children[index];
  mutate({ kind: 'selected_release', value: element.getAttribute('data-id') })
}
</script>

<template>
  <Error v-if="isError" :error="error" />
  <Loader v-if="isLoading" />
  <div v-if="!isLoading && !isError" className="flex flex-col container mx-auto px-8 py-4">
    <section className="grid grid-cols-1 lg:grid-cols-[10fr,auto] gap-4">
      <div>
        <h2 class="my-2 px-2">Release</h2>
        <div v-if="!!selectedRelease" class="card bg-base-100 shadow-xl w-full">
          <div class="card-body p-4">
            <div className="py-2">
              <h1 className="text-lg py-2">Identified as</h1>
              <h2 className="text-md">
                <template v-for="artist, i in sourceRelease.artists" :key="i">
                  <span className="text-primary">{{ artist }}</span>
                  <span v-if="i != sourceRelease.artists.length - 1">,</span>
                </template>
                - {{ sourceRelease.title }} <span class="text-sm">({{ sourceTracks.length }} tracks)</span>
              </h2>
              <h2 className="text-lg py-2">Tagging as</h2>
              <h2 className="text-md">
                <ArtistNames v-if="!!selectedReleaseArtists" :included="doc.included" :artists="selectedReleaseArtists"
                  :musicbrainz="true" />
                -
                <a className="link" :href="`https://musicbrainz.org/release/${selectedRelease.id}`" target="_blank">
                  {{ selectedRelease.attributes.title }}
                </a>
                <span v-if="selectedRelease.attributes.disambiguation"> ({{ selectedRelease.attributes.disambiguation
                }}) </span>
                <span class="text-sm">({{ selectedReleaseMediums.reduce((count, med) => count +
                  med.attributes.tracks,
                  0)
                }} tracks)</span>
              </h2>
            </div>
            <select v-if="selectedRelease" className="select select-secondary mx-2" :value="releaseTitle(selectedRelease)"
              :disabled="isLoading || isMutationLoading" @change="selectRelease">
              <option v-for="release, i in releases" :key="i" :disabled="i == selectedReleaseId"
                :selected="i == selectedReleaseId" :data-id="release.id">{{ releaseTitle(release) }}</option>
            </select>
          </div>
        </div>
      </div>

      <div>
        <h2 class="my-2 px-2">Cover</h2>
        <div v-if="!!selectedCover" class="card w-64 bg-base-100 shadow-xl">
          <figure><img :src="selectedCover.url" :alt="`${selectedCover.artist} - ${selectedCover.title}`" /></figure>
          <div class="card-body p-4">
            <p>{{ selectedCover.artist }} - {{ selectedCover.title }}</p>
            <div class="card-actions overflow-hidden">
              <select className="select select-secondary overflow-hidden truncate" :value="coverTitle(selectedCover)"
                :disabled="isLoading || isMutationLoading" @change="selectCover">
                <option v-for="cover, i in covers" :key="i" :disabled="i == selectedCoverId"
                  :selected="i == selectedCoverId">{{ coverTitle(cover) }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- <main className="columns-1 lg:columns-2"> -->
    <!--   <section> -->
    <!--     <h3 className="text-lg">Source tracks</h3> -->
    <!--     {data!.tracks -->
    <!--     .sort((a, b) => -->
    <!--     a.disc != b.disc ? cmp(a.disc, b.disc) : cmp(a.number, b.number) -->
    <!--     ) -->
    <!--     .map((track, i) => ( -->
    <!--     <Track key={i} {...track} /> -->
    <!--     ))} -->
    <!--   </section> -->
    <!--   <section> -->
    <!--     <h3 className="text-lg">Final tracks</h3> -->
    <!--     {selected_search_result.mapping -->
    <!--     .map((to) => selected_search_result.search_result[1][to]) -->
    <!--     .sort((a, b) => { -->
    <!--     const a_disc = disc(selected_search_result.search_result[0], a), -->
    <!--     b_disc = disc(selected_search_result.search_result[0], b); -->
    <!--     return a_disc != b_disc -->
    <!--     ? cmp(a_disc, b_disc) -->
    <!--     : cmp(a.track.number, b.track.number); -->
    <!--     }) -->
    <!--     .map((track, i) => ( -->
    <!--     <FullTrackComponent key={i} track={track} release={selected_search_result.search_result[0]} /> -->
    <!--     ))} -->
    <!--   </section> -->
    <!-- </main> -->
    <!-- <button className="btn self-end my-8" disabled={update.isLoading || proceed.isLoading}> -->
    <!--   Proceed -->
    <!-- </button> -->
  </div>
</template>
