import { createRouter, createWebHistory } from 'vue-router'

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

export default router
