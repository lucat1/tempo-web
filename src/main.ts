import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin as formkit, defaultConfig } from '@formkit/vue'
import { VueQueryPlugin } from "@tanstack/vue-query";

import './style.css'
import formkitConfig from '../formkit.config.ts'

import App from '@/App.vue'
import router from '@/router'
import { monitor } from '@/stores/server'

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(formkit, defaultConfig(formkitConfig))
app.use(VueQueryPlugin)
app.mount('#app')

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register(
    import.meta.env.MODE === 'production' ? '/service-worker.js' : '/dev-sw.js?dev-sw'
  )
}

monitor()
