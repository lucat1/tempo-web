import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin as formkit, defaultConfig } from '@formkit/vue'
import { VueQueryPlugin } from "@tanstack/vue-query";

import './style.css'
import formkitConfig from '../formkit.config.ts'

import App from '@/App.vue'
import router from '@/router'

const pinia = createPinia()

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(formkit, defaultConfig(formkitConfig))
app.use(VueQueryPlugin)
app.mount('#app')
