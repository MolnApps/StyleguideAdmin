import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import myStore from '@/store.js'
import bus from '@/bus.js'
import VModal from 'vue-js-modal'

class StateHelper {
	constructor() 
	{
		this.localVue = createLocalVue()
		this.localVue.use(Vuex)
		this.localVue.use(VModal);
	}

	freshStore()
	{
		let newStore = new Vuex.Store(myStore);
		newStore.dispatch('ui/enable');
	    return newStore;
	}

	emit(eventName)
	{
		bus.$emit(eventName);
	}
}

export default StateHelper;