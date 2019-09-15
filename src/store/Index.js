export default {
	namespaced: true,
	state: {
		index: []
	},
	mutations: {
		initialize (state, payload) {
			state.index = payload;
		},
	},
	getters: {
		index (state) {
			return state.index;
		}
	},
	actions: {
		initialize (context, payload) {
			context.commit('initialize', payload);
		}
	}
}