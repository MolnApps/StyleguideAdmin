const uiModule = {
	namespaced: true,
	state: {
		status: 'enabled'
	},
	mutations: {
		enable (state) {
	    	state.status = 'enabled';
		},
		disable (state) {
	    	state.status = 'disabled';
		}
	},
	getters: {
		status (state) {
			return state.status;
		},
		isLocked (state) {
			return state.status != 'enabled';
		}
	},
	actions: {
		enable (context) {
			context.commit('enable');
		},
		disable (context) {
			context.commit('disable');
		}
	}
}

export default {
	modules: {
		ui: uiModule
	}
}