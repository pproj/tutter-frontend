import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { createPinia, PiniaVuePlugin } from 'pinia'

import axios from "axios";

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '@/assets/style.css'

import App from './App.vue'
import router from './router'

Vue.use(PiniaVuePlugin)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

Vue.prototype.$api = axios.create({
  baseURL: import.meta.env.VITE_API_ROOT
});

Vue.prototype.$showToast = function (text, type = 'error', title = '', local=true) {

  let options = {}
  switch (type) {
    case "error":
      options = {
        title: "Error!",
        variant: "danger"
      }
      break;
    case "user_error":
      options = {
        title: "Warning!",
        variant: "warning"
      }
      break;
    case "success":
      options = {
        title: "Success!",
        variant: "success"
      }
      break;
  }

  if (title !== '') {
    options.title = title
  }

  const bvToast = local ? this.$bvToast : this.$root.$bvToast

  bvToast.toast(text, {
    ...options,
    toaster: 'b-toaster-top-right',
    solid: true,
    appendToast: false
  })
}

new Vue({
  router,
  pinia: createPinia(),
  render: (h) => h(App)
}).$mount('#app')
