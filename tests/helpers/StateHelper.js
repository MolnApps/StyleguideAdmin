import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import myStore from '@/store.js'
import bus from '@/bus.js'

class StateHelper {
	constructor() 
	{
		this.localVue = createLocalVue()
		this.localVue.use(Vuex)
		
		let notifyMock = jest.fn();
		this.notifyMock = notifyMock;

		this.localVue.use({
			install(Vue, args = {}) {
				Vue.prototype['$notify'] = notifyMock;
				Vue['notify'] = notifyMock;
			}
		});
	}

	notSeeFeedback()
	{
		expect(this.notifyMock).toHaveBeenCalledTimes(0);
	}

	seeFeedback()
	{
		expect(this.notifyMock).toHaveBeenCalledTimes(1);
		expect(this.notifyMock).toHaveBeenCalledWith({type: 'success', text: 'The page was updated.'});
	}

	notifyMockFn()
	{
		return this.notifyMock;
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

	uninstall()
	{
		jest.clearAllMocks();
	}
}

export default StateHelper;