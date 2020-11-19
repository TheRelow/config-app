import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/connections',
    name: 'Connections',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "connections" */ '../views/Connections.vue'),
    children: [
      {
        path: '/',
        name: 'main',
        component: () => import(/* webpackChunkName: "docs-main" */ '../views/connections/index.vue'),
      },
      {
        path: '/connections/detail',
        name: 'detail',
        component: () => import(/* webpackChunkName: "docs-detail" */ '../views/connections/detail.vue'),
      },
    ]
  },
  {
    path: '/table',
    name: 'table',
    // route level code-splitting
    // this generates a separate chunk (table.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "table" */ '../views/PageTable.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
