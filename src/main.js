import Vue from 'vue'
import store from './store'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router'

import 'typeface-roboto/index.css'
import './assets/main.scss'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
