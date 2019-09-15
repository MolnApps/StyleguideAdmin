export default {
	namespaced: true,
	state () {
		return {
			all: [],
			dictionary: {},
		}
	},
	mutations: {
		initialize (state, payload) {
			if (payload['_library'] !== undefined) {
				state.all = payload._library;
			} else {
				state.all = payload;
			}
			state.dictionary = payload;
		},
		removeById (state, id) {
			state.all = state.all.filter((el) => {
                return el.id !== id;
            });
		},
		overrideById (state, payload) {
			state.all = state.all.map((el) => {
                return el.id == payload.id 
                	? payload.record 
                	: el;
            });
		},
		add (state, record) {
			state.all.push(record);
		}
	},
	getters: {
		all (state) {
			return state.all;
		},
		allById: (state) => (id) => {
			return state.all.filter((el) => {
                return el.id == id;
            });
		},
		byId: (state) => (id) => {
			return state.all.filter((el) => {
				return el.id == id;
			})[0];
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
		},
		removeById(context, id) {
			context.commit('removeById', id);
		},
		overrideById(context, payload) {
			context.commit('overrideById', payload);
		},
		add(context, record) {
			context.commit('add', record);
		}
	}
}