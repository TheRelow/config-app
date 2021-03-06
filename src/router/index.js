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
    // this generates a separate chunk (connections.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "connections" */ '../views/Connections.vue'),
    children: [
      {
        path: '/',
        name: 'main',
        component: () => import(/* webpackChunkName: "connections-main" */ '../views/connections/index.vue'),
      },
      {
        path: '/connections/:fullPath',
        name: 'detail',
        component: () => import(/* webpackChunkName: "connections-detail" */ '../views/connections/detail.vue'),
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
