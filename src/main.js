import Vue from 'vue'
import App from './App.vue'

import storePlugin from './storePlugin'
Vue.use(storePlugin)

import busPlugin from './busPlugin'
Vue.use(busPlugin)

import Notifications from 'vue-notification'
Vue.use(Notifications)

Vue.config.productionTip = true

new Vue({
  render: h => h(App),
}).$mount('#app')