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
		myStore.state.status = 'enabled';
	    return new Vuex.Store(myStore);
	}

	emit(eventName)
	{
		bus.$emit(eventName);
	}
}

export default StateHelper;