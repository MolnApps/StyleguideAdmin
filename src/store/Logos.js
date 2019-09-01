export default {
	namespaced: true,
	state: {
		all: [],
		dictionary: {},
	},
	mutations: {
		initialize (state, payload) {
			state.all = payload._library;
			state.dictionary = payload;
		}
	},
	getters: {
		all (state) {
			return state.all;
		},
		byPageSlug: (state) => (slug) => {
			return state.dictionary[slug];
		},
		countByPageSlug: (state) => (slug) => {
			return  state.dictionary[slug] !== undefined
				? state.dictionary[slug].length
				: 0;
		},
	},
	actions: {
		initialize (context, payload) {
			context.commit('initialize', payload);
		}
	}
}