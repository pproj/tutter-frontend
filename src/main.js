import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { createPinia, PiniaVuePlugin } from 'pinia'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import App from './App.vue'
import router from './router'

Vue.use(PiniaVuePlugin)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  router,
  pinia: createPinia(),
  render: (h) => h(App)
}).$mount('#app')
