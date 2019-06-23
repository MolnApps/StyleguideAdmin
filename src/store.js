export default {
	state: {
		status: 'enabled'
	},
	mutations: {
		ENABLE_BUTTONS (state) {
	    	state.status = 'enabled';
		},
		DISABLE_BUTTONS (state) {
	    	state.status = 'disabled';
		}
	}
}