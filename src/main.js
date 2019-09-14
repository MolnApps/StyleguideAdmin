import Vue from 'vue'
import App from './App.vue'

import storePlugin from './storePlugin'
Vue.use(storePlugin)

import busPlugin from './busPlugin'
Vue.use(busPlugin)

import Notifications from 'vue-notification'
Vue.use(Notifications)

import VModal from 'vue-js-modal'
Vue.use(VModal)

Vue.config.productionTip = true
Vue.config.devtools = true

new Vue({
  render: h => h(App),
}).$mount('#app')