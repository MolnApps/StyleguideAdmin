import { mount, shallowMount } from '@vue/test-utils'
import IndexItem from '@/components/IndexItem.vue'
import {TestHelper, IndexHelper} from './../helpers/Helpers.js'
import Draggable from 'vuedraggable'

describe('IndexItem.vue', () => {
	let wrapper;
	let ui;
	let indexHelper;
	let index;

	beforeEach(() => {
		indexHelper = new IndexHelper();
		index = indexHelper.makeStructure();
	})

	it ('can be instantiated', () => {
		bootstrapWrapper();
	})

	it ('passes on the end event when the draggable emits an end event', () => {
		bootstrapWrapper();

		ui.notExpectEvent('end');

		wrapper.find(Draggable).vm.$emit('end');

		ui.expectEvent('end');
	})

	it ('passes on the end event when the nested index item emits an end event', () => {
		bootstrapWrapper();

		ui.notExpectEvent('end');

		wrapper.find(IndexItem).vm.$emit('end');

		ui.expectEvent('end');
	})

	it ('removes an item from the index when the draggable emits a change event', () => {
		bootstrapWrapper();

		expect(index.length).toBe(2);

		wrapper.find(Draggable).vm.$emit('change', {removed: {element: {id:1, parent_id: null}, oldIndex: 0}});

		expect(index.length).toBe(1);
	})

	it ('removes an item from the index when the nested draggable emits a change event', () => {
		bootstrapWrapper();

		expect(index[1].children.length).toBe(1);

		let p = wrapper.find(Draggable).findAll(IndexItem).at(3).find(Draggable);

		p.vm.$emit('change', {removed: {element: {id:5, parent_id: 4}, oldIndex: 0}});

		expect(index[1].children.length).toBe(0);
	})

	it ('updates the position of the items when the nested draggable emits a change:removed event', () => {
		bootstrapWrapper();

		expect(index[0].children.length).toBe(2);
		expect(index[0].children[0].position).toBe(1);
		expect(index[0].children[1].position).toBe(2);

		let p = wrapper.find(Draggable).findAll(IndexItem).at(0).find(Draggable);

		p.vm.$emit('change', {removed: {element: {id:2, parent_id: 1}, oldIndex: 0}});

		expect(index[0].children.length).toBe(1);
		expect(index[0].children[0].position).toBe(0);
	})

	it ('adds an item to the index when the draggable emits a change event', () => {
		bootstrapWrapper();

		expect(index.length).toBe(2);
		expect(index[1].id).toBe(4);
		expect(index[1].parent_id).toBe(null);

		wrapper.find(Draggable).vm.$emit('change', {added: {element: {id:5, parent_id: 4}, oldIndex: 0, newIndex: 1}});

		expect(index.length).toBe(3);
		expect(index[1].id).toBe(5);
		expect(index[1].parent_id).toBe(null);
	})

	it ('adds an item to the index when the nested draggable emits a change event', () => {
		bootstrapWrapper();

		expect(index[0].children.length).toBe(2);
		expect(index[0].children[1].id).toBe(3);
		expect(index[0].children[1].parent_id).toBe(1);

		let p = wrapper.find(Draggable).findAll(IndexItem).at(0).find(Draggable);

		p.vm.$emit('change', {added: {element: {id:5, parent_id: 4}, oldIndex: 0, newIndex: 1}});

		expect(index[0].children.length).toBe(3);
		expect(index[0].children[1].id).toBe(5);
		expect(index[0].children[1].parent_id).toBe(1);
	})

	it ('updates the position of the items when the nested draggable emits a change:added event', () => {
		bootstrapWrapper();

		expect(index[0].children.length).toBe(2);
		expect(index[0].children[0].position).toBe(1);
		expect(index[0].children[1].position).toBe(2);

		let p = wrapper.find(Draggable).findAll(IndexItem).at(0).find(Draggable);

		p.vm.$emit('change', {added: {element: {id:5, parent_id: 4}, oldIndex: 0, newIndex: 1}});

		expect(index[0].children.length).toBe(3);
		expect(index[0].children[0].position).toBe(0);
		expect(index[0].children[1].position).toBe(1);
		expect(index[0].children[2].position).toBe(2);
	})

	it ('updates the index when draggable emits a change event', () => {
		bootstrapWrapper();

		expect(index.length).toBe(2);
		expect(index[0].id).toBe(1);
		expect(index[1].id).toBe(4);

		wrapper.find(Draggable).vm.$emit('change', {moved: {element: {id:4, parent_id: null}, oldIndex: 1, newIndex: 0}});

		expect(index.length).toBe(2);
		expect(index[0].id).toBe(4);
		expect(index[1].id).toBe(1);
	})

	it ('updates the position when draggable emits a change event', () => {
		bootstrapWrapper();

		expect(index.length).toBe(2);
		expect(index[0].position).toBe(0);
		expect(index[1].position).toBe(3);

		wrapper.find(Draggable).vm.$emit('change', {moved: {element: {id:4, parent_id: null}, oldIndex: 1, newIndex: 0}});

		expect(index.length).toBe(2);
		expect(index[0].position).toBe(0);
		expect(index[1].position).toBe(1);
	})

	it ('updates the index when nested draggable emits a change event', () => {
		bootstrapWrapper();

		expect(index[0].children.length).toBe(2);
		expect(index[0].children[0].id).toBe(2);
		expect(index[0].children[1].id).toBe(3);

		let p = wrapper.find(Draggable).findAll(IndexItem).at(0).find(Draggable);

		p.vm.$emit('change', {moved: {element: {id:3, parent_id: 1}, oldIndex: 1, newIndex: 0}});

		expect(index[0].children.length).toBe(2);
		expect(index[0].children[0].id).toBe(3);
		expect(index[0].children[1].id).toBe(2);
	})

	it ('updates the position of the items when nested draggable emits a change:moved event', () => {
		bootstrapWrapper();

		expect(index[0].children.length).toBe(2);
		expect(index[0].children[0].position).toBe(1);
		expect(index[0].children[1].position).toBe(2);

		let p = wrapper.find(Draggable).findAll(IndexItem).at(0).find(Draggable);

		p.vm.$emit('change', {moved: {element: {id:3, parent_id: 1}, oldIndex: 1, newIndex: 0}});

		expect(index[0].children.length).toBe(2);
		expect(index[0].children[0].position).toBe(0);
		expect(index[0].children[1].position).toBe(1);
	})

	let bootstrapWrapper = () => {
		wrapper = mount(IndexItem, {
			propsData: {
				index: index,
				owner: {id: 0, children: index}
			}
		});

		ui = new TestHelper(wrapper);

		indexHelper.setTestHelper(ui).setWrapper(wrapper);
	}
})