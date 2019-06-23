import store from './store'

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let storeVuex = new Vuex.Store(store);

export default {
	storeVuex,
	install (Vue, options) {
		Vue.prototype.$store = storeVuex
	}
}