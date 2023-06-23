import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { plugin as formkit, defaultConfig } from '@formkit/vue'

import './style.css'
import formkitConfig from '../formkit.config.ts'

import App from '@/App.vue'
import Home from '@/pages/Home.vue'
import Connect from '@/pages/Connect.vue'
import { useServer } from '@/stores/server'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: Home },
    { path: '/connect', name: 'Connect', component: Connect },
  ]
})

router.beforeEach((to, _, next) => {
  const server = useServer()

  if (!server.authenticated && to.name != 'Connect') next({ name: 'Connect' })
  else if (server.authenticated && to.name == 'Connect') next({ name: 'Home' })
  else next()
})

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(formkit, defaultConfig(formkitConfig))
app.mount('#app')
