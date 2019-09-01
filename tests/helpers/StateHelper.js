import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import myStore from '@/store.js'
import bus from '@/bus.js'

class StateHelper {
	constructor() 
	{
		this.localVue = createLocalVue()
		this.localVue.use(Vuex)
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