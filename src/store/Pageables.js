import Vue from 'vue';

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
		},
		addToPage (state, payload) {
			this._initializePageSlug(state, payload.page);

			state.dictionary[payload.page.slug].push(payload.record);
		},
		removeFromPage (state, payload) {
			this._initializePageSlug(state, payload.page);

			state.dictionary[payload.page.slug] = 
				state.dictionary[payload.page.slug].filter((currentRecord) => {
                	return currentRecord.id != payload.record.id;
            	});
		},
		removeFromPageByIndex (state, payload) {
			this._initializePageSlug(state, payload.page);
			
			state.dictionary[payload.page.slug].splice(payload.index, 1);
		},
		removeFromPageByIdAndPivot (state, payload) {
			this._initializePageSlug(state, payload.page);

			state.dictionary[payload.page.slug] = 
				state.dictionary[payload.page.slug].filter((currentRecord) => {
                	return ! (currentRecord.id == payload.record.id && 
                		currentRecord.pivot.preferences[payload.pivotProperty] == 
                			payload.record.pivot.preferences[payload.pivotProperty]);
            	});
		},
		_initializePageSlug (state, page) {
			if (state.dictionary[page.slug] === undefined) {
				Vue.set(state.dictionary, page.slug, []);
			}
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
			return state.dictionary[slug] !== undefined 
				? state.dictionary[slug] 
				: [];
		},
		countByPageSlug: (state) => (slug) => {
			return  state.dictionary[slug] !== undefined
				? state.dictionary[slug].length
				: 0;
		},
		pageHas: (state) => (payload) => {
			return state.dictionary[payload.page.slug].filter((currentRecord) => {
                return currentRecord.id == payload.record.id;
            }).length > 0;
		},
		pageHasWithPivot: (state) => (payload) => {
			return state.dictionary[payload.page.slug].filter((currentRecord) => {
			    return currentRecord.id == payload.record.id && 
			    	currentRecord.pivot.preferences[payload.pivotProperty] == 
			    		payload.record.pivot.preferences[payload.pivotProperty];
			}).length > 0;
		},
		idsForPage: (state) => (page) => {
			return state.dictionary[page.slug].map((record) => {
                return record.id;
            });
		},
		idsAndPivotForPage: (state) => (payload) => {
			return state.dictionary[payload.page.slug].map((record) => {
				let tmp = {};
				tmp['id'] = record.id;
				tmp[payload.pivotProperty] = record.pivot.preferences[payload.pivotProperty];
                return tmp;
            });
		}
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
		},
		addToPage(context, payload) {
			context.commit('addToPage', payload);
		},
		removeFromPage(context, payload) {
			context.commit('removeFromPage', payload);
		},
		removeFromPageByIndex(context, payload) {
			context.commit('removeFromPageByIndex', payload);
		},
		removeFromPageByIdAndPivot(context, payload) {
			context.commit('removeFromPageByIdAndPivot', payload);
		}
	}
}