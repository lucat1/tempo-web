<script setup lang="ts">
import type { FormKitNode } from '@formkit/core'

import { useServer } from '@/stores/server'
import router from '@/router'

const server = useServer()

const checkServer = async function (node: FormKitNode) {
  if (server.forget)
    server.forget()
  try {
    return server.connect(new URL(node.value as string))
  } catch (_) {
    return false
  }
}

checkServer.blocking = true
checkServer.skipEmpty = false
checkServer.debounce = 200
checkServer.force = false

interface FormData {
  url: string
  username: string
  password: string
}

const submitHandler = async ({ username, password }: FormData) => {
  if (await server.authenticate({ username, password })) {
    router.push({ name: 'Home' })
  }
}
</script>

<template>
  <main class="flex flex-1 items-center justify-center">
    <FormKit type="form" form-class="card shadow-xl bg-neutral p-8" submit-label="Register" @submit="submitHandler"
      :actions="false">
      <h1 class="text-2xl pb-4">Connect to your server</h1>
      <div class="grid md:grid-cols-2 gap-6">
        <FormKit type="url" :value="server.host" name="host" label="Your tempo host" placeholder="https://example.com"
          help="The hostname of your music server" validation="checkServer" :validation-rules="{ checkServer }" />
        <div class="flex flex-row items-center justify-start">
          <div class="w-5 h-5 rounded-full mx-4" :class="server.connected ? 'bg-success' : 'bg-error'" />
          <span v-if="server.connected">{{ server.attributes.server }} v{{ server.attributes.server_version }}</span>
          <span v-else>Not connected</span>
        </div>
        <FormKit type="text" name="username" label="Username" placeholder="Username" help="Your account username"
          :validation="server.authRequired ? 'required' : ''" :disabled="!server.authRequired" />
        <FormKit type="password" name="password" label="Password" :validation="server.authRequired ? 'required' : ''"
          :disabled="!server.authRequired" :validation-messages="{
            matches: 'Please include at least one symbol',
          }" placeholder="Your password" help="Choose a password" />
      </div>

      <div class="divider"></div>
      <div class="flex justify-end">
        <FormKit type="submit" label="Login" />
      </div>
    </FormKit>
  </main>
</template>
