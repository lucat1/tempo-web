import { createRouter, createWebHistory } from 'vue-router'

import Index from '@/pages/Index.vue'
import Connect from '@/pages/Connect.vue'

import Layout from '@/Layout.vue'
import Home from '@/pages/Home.vue'
import Search from '@/pages/Search.vue'
import Artists from '@/pages/Artists.vue'
import Releases from '@/pages/Releases.vue'

import { useServer } from '@/stores/server'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '', name: 'Index', component: Index },
    { path: '/connect', name: 'Connect', component: Connect },
    {
      path: '',
      name: 'Layout',
      component: Layout,
      children: [
        {
          path: '/',
          name: 'Home',
          component: Home,
        },
        {
          path: 'search',
          name: 'Search',
          component: Search,
        },
        {
          path: 'artists',
          name: 'Artists',
          component: Artists,
        },
        {
          path: 'releases',
          name: 'Releases',
          component: Releases,
        },
      ],

    },
  ]
})

router.beforeEach((to, _, next) => {
  const server = useServer()

  if (to.name === 'Index' && server.authenticated) next({ name: 'Layout' })
  else if (!server.authenticated && to.name != 'Connect') next({ name: 'Connect' })
  else if (server.authenticated && to.name == 'Connect') next({ name: 'Layout' })
  else next()
})

export default router
