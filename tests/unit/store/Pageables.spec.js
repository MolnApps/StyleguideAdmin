import { mount, shallowMount } from '@vue/test-utils'
import Pageables from '@/store/Pageables.js'

describe('Pageables.vue', () => {
	describe('Getters', () => {
		it ('returns all the pages', () => {
			const state = {
				all: []
			}

			expect(Pageables.getters['all'](state)).toEqual([]);
		})

		it ('returns all the pages by id', () => {
			const state = {
				all: [
					{id: 1, title: 'Foo'},
					{id: 2, title: 'Bar'},
					{id: 3, title: 'Baz'},
					{id: 2, title: 'BarBaz'},
					{id: 4, title: 'Foobar'},
				]
			}

			expect(Pageables.getters['allById'](state)(2)).toEqual([
				{id: 2, title: 'Bar'}, 
				{id:2, title: 'BarBaz'}
			]);
		})

		it ('returns the first page by id', () => {
			const state = {
				all: [
					{id: 1, title: 'Foo'},
					{id: 2, title: 'Bar'},
					{id: 3, title: 'Baz'},
					{id: 2, title: 'BarBaz'},
					{id: 4, title: 'Foobar'},
				]
			}

			expect(Pageables.getters['byId'](state)(2)).toEqual({id: 2, title: 'Bar'});
		})

		it ('returns elements by a page slug', () => {
			const state = {
				dictionary: {
					'page-1': [{id: 1, title: 'Foo'}],
					'page-2': [{id: 2, title: 'Bar'}],
					'page-3': [{id: 3, title: 'Baz'}],
				}
			}

			expect(Pageables.getters['byPageSlug'](state)('page-2')).toEqual([{id: 2, title: 'Bar'}]);
			expect(Pageables.getters['byPageSlug'](state)('page-4')).toEqual([]);
		})

		it ('returns an empty array if page slug does not exist', () => {
			const state = {
				dictionary: {
				}
			}

			expect(Pageables.getters['byPageSlug'](state)('page-4')).toEqual([]);
		})

		it ('returns elements count by a page slug', () => {
			const state = {
				dictionary: {
					'page-1': [{id: 1, title: 'Foo'}],
					'page-2': [{id: 2, title: 'Bar'}],
					'page-3': [{id: 3, title: 'Baz'}],
				}
			}

			expect(Pageables.getters['countByPageSlug'](state)('page-2')).toEqual(1);
			expect(Pageables.getters['countByPageSlug'](state)('page-4')).toEqual(0);
		})

		it ('asserts that a page has an element by id', () => {
			const state = {
				dictionary: {
					'page-1': [{id: 1, title: 'Foo'}],
					'page-2': [{id: 2, title: 'Bar'}],
					'page-3': [{id: 3, title: 'Baz'}],
				}
			}

			expect(Pageables.getters['pageHas'](state)({
				page: {slug: 'page-1'}, 
				record: {id: 1}
			})).toEqual(true);
			
			expect(Pageables.getters['pageHas'](state)({
				page: {slug: 'page-1'}, 
				record: {id: 2}
			})).toEqual(false);
		})

		it ('asserts that a page has an element by id and pivot property', () => {
			const state = {
				dictionary: {
					'page-1': [
						{id: 1, title: 'Foo', pivot: {preferences: {color: 'red'}}},
						{id: 1, title: 'Bar', pivot: {preferences: {color: 'blue'}}},
					],
				}
			}

			expect(Pageables.getters['pageHasWithPivot'](state)({
				page: {slug: 'page-1'}, 
				record: {id: 1, pivot: {preferences: {color: 'red'}}},
				pivotProperty: 'color',
			})).toEqual(true);

			expect(Pageables.getters['pageHasWithPivot'](state)({
				page: {slug: 'page-1'}, 
				record: {id: 1, pivot: {preferences: {color: 'green'}}},
				pivotProperty: 'color',
			})).toEqual(false);
		})

		it ('returns an array of ids for pageables associated with a page', () => {
			const state = {
				dictionary: {
					'page-1': [
						{id: 1, title: 'Foo'},
						{id: 3, title: 'Bar'},
					],
					'page-2': [
						{id: 2, title: 'Baz'}
					]
				}
			}

			expect(Pageables.getters['idsForPage'](state)({slug: 'page-1'})).toEqual([1, 3]);
		})

		it ('returns an array of ids and pivot data for pageables associated with a page', () => {
			const state = {
				dictionary: {
					'page-1': [
						{id: 1, title: 'Foo', pivot: {preferences: {color: 'red'}}},
						{id: 3, title: 'Bar', pivot: {preferences: {color: 'blue'}}},
					],
					'page-2': [
						{id: 2, title: 'Foo', pivot: {preferences: {color: 'green'}}},
					],
				}
			}

			expect(Pageables.getters['idsAndPivotForPage'](state)({
				page: {slug: 'page-1'}, 
				pivotProperty: 'color',
			})).toEqual([
				{id: 1, color: 'red'}, 
				{id: 3, color: 'blue'}
			]);
		})
	})

	describe('Mutators', () => {
		let payload;

		beforeEach (() => {
			payload = {
				'_library': [{id: 1, title: 'Red'}, {id: 2, title: 'Green'}, {id: 3, title: 'Blue'}],
				'page-1': [{id: 1, title: 'Red'}],
				'page-2': [{id: 2, title: 'Green'}, {id: 3, title: 'Blue'}],
				'page-3': [],
			}
		})

		it ('initializes the store', () => {
			const state = {
				all: [],
				dictionary: {},
			}

			expect(state.all).toEqual([]);
			expect(state.dictionary).toEqual({});

			Pageables.mutations['initialize'](state, payload)

			expect(state.all).toBe(payload['_library']);
			expect(state.dictionary).toBe(payload);
		})

		it ('initializes the store without a library property', () => {
			const state = {
				all: [],
				dictionary: {},
			}

			let dictionary = {
				'page-1': [{id: 1, title: 'Red'}],
				'page-2': [{id: 2, title: 'Green'}, {id: 3, title: 'Blue'}],
				'page-3': [],
			}

			expect(state.all).toEqual([]);
			expect(state.dictionary).toEqual({});

			Pageables.mutations['initialize'](state, dictionary)

			expect(state.all).toBe(dictionary);
			expect(state.dictionary).toBe(dictionary);
		})

		it ('removes a pageable by id', () => {
			const state = {
				all: [{id: 1}, {id: 2}, {id: 3}, {id: 2}]
			}

			expect(state.all.length).toBe(4);

			Pageables.mutations['removeById'](state, 2);

			expect(state.all.length).toBe(2);
		})

		it ('overrides a pageable by id', () => {
			const state = {
				all: [
					{id: 1, title: 'Red'}, 
					{id: 2, title: 'Green'}, 
					{id: 3, title: 'Blue'}, 
					{id: 2, title: 'Brown'}
				]
			}

			expect(state.all.length).toBe(4);
			expect(state.all[1]).toEqual({id: 2, title: 'Green'});
			expect(state.all[3]).toEqual({id: 2, title: 'Brown'});

			Pageables.mutations['overrideById'](state, {
				id: 2, 
				record: {id: 2, title: 'Orange'}
			});

			expect(state.all.length).toBe(4);
			expect(state.all[1]).toEqual({id: 2, title: 'Orange'});
			expect(state.all[3]).toEqual({id: 2, title: 'Orange'});
		})

		it ('adds a pageable to the library', () => {
			const state = {
				all: [
					{id: 1, title: 'Red'}, 
					{id: 2, title: 'Green'}, 
					{id: 3, title: 'Blue'}, 
				]
			}

			expect(state.all.length).toBe(3);
			
			Pageables.mutations['add'](state, {id: 4, title: 'Orange'});

			expect(state.all.length).toBe(4);
		})

		it ('adds a pageable to a page by slug', () => {
			const state = {
				dictionary: {
					'page-1': [{id: 1, title: 'Red'}],
					'page-2': [{id: 2, title: 'Green'}, {id: 3, title: 'Blue'}],
					'page-3': [],
				}
			}

			expect(state.dictionary['page-1'].length).toBe(1);
			
			Pageables.mutations['addToPage'](state, {
				page: {id: 1, slug: 'page-1'}, 
				record: {id: 4, title: 'Orange'}
			});

			expect(state.dictionary['page-1'].length).toBe(2);
		})

		it ('adds a pageable to a page by slug if it does not exists', () => {
			const state = {
				dictionary: {
					'page-1': [{id: 1, title: 'Red'}],
					'page-2': [{id: 2, title: 'Green'}, {id: 3, title: 'Blue'}],
					'page-3': [],
				}
			}

			expect(state.dictionary['page-4']).toBe(undefined);
			
			Pageables.mutations['addToPage'](state, {
				page: {id: 1, slug: 'page-4'}, 
				record: {id: 4, title: 'Orange'}
			});

			expect(state.dictionary['page-4'].length).toBe(1);
		})

		it ('removes a pageable from a page by slug', () => {
			const state = {
				dictionary: {
					'page-1': [{id: 1, title: 'Red'}],
					'page-2': [{id: 2, title: 'Green'}, {id: 3, title: 'Blue'}],
					'page-3': [],
				}
			}

			expect(state.dictionary['page-2'].length).toBe(2);
			
			Pageables.mutations['removeFromPage'](state, {
				page: {slug: 'page-2'}, 
				record: {id: 3}
			});

			expect(state.dictionary['page-2'].length).toBe(1);
		})

		it ('removes a pageable from a page by index', () => {
			const state = {
				dictionary: {
					'page-1': [{id: 1, title: 'Red'}],
					'page-2': [{id: 2, title: 'Green'}, {id: 3, title: 'Blue'}],
					'page-3': [],
				}
			}

			expect(state.dictionary['page-2'].length).toBe(2);
			
			Pageables.mutations['removeFromPageByIndex'](state, {
				page: {slug: 'page-2'}, 
				index: 0
			});

			expect(state.dictionary['page-2'].length).toBe(1);
			expect(state.dictionary['page-2'][0]).toEqual({id: 3, title: 'Blue'});
		})

		it ('removes a pageable from a page by id and by pivot', () => {
			const state = {
				dictionary: {
					'page-1': [
						{id: 1, title: 'Foo', pivot: {preferences: {color: 'red'}}}
					],
					'page-2': [
						{id: 2, title: 'Bar', pivot: {preferences: {color: 'lime'}}}, 
						{id: 2, title: 'Bar', pivot: {preferences: {color: 'green'}}}, 
						{id: 3, title: 'Baz', pivot: {preferences: {color: 'blue'}}}
					],
					'page-3': [],
				}
			}

			expect(state.dictionary['page-2'].length).toBe(3);
			
			Pageables.mutations['removeFromPageByIdAndPivot'](state, {
				page: {slug: 'page-2'}, 
				record: {id: 2, pivot: {preferences: {color: 'green'}}},
				pivotProperty: 'color'
			});

			expect(state.dictionary['page-2'].length).toBe(2);
			expect(state.dictionary['page-2'][0].title).toEqual('Bar');
			expect(state.dictionary['page-2'][0].pivot.preferences.color).toEqual('lime');
			expect(state.dictionary['page-2'][1].title).toEqual('Baz');
			expect(state.dictionary['page-2'][1].pivot.preferences.color).toEqual('blue');
		})
	})
})