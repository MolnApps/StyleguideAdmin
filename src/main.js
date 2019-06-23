import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

import storePlugin from './storePlugin'
Vue.use(storePlugin)

import busPlugin from './busPlugin'
Vue.use(busPlugin)

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

new Vue({
  render: h => h(App),
}).$mount('#app')