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

	it ('updates the position of the items when the nested draggable emits a change:removed event', () => {
		bootstrapWrapper();

		expect(index[0].children[0].position).toBe(1);
		expect(index[0].children[1].position).toBe(2);

		let p = wrapper.find(Draggable).findAll(IndexItem).at(0).find(Draggable);

		p.vm.$emit('change', {removed: {element: index[0].children[0], oldIndex: 0}});

		expect(index[0].children[0].position).toBe(0);
		expect(index[0].children[1].position).toBe(1);
	})

	it ('updates the parent id of the item when the nested draggable emits a change:added event', () => {
		bootstrapWrapper();

		expect(index[1].children[0].parent_id).toBe(4);

		let p = wrapper.find(Draggable).findAll(IndexItem).at(0).find(Draggable);

		p.vm.$emit('change', {added: {element: index[1].children[0], oldIndex: 0, newIndex: 1}});

		expect(index[1].children[0].parent_id).toBe(1);
	})

	it ('updates the position of the items when the nested draggable emits a change:added event', () => {
		bootstrapWrapper();

		expect(index[0].children[0].position).toBe(1);
		expect(index[0].children[1].position).toBe(2);
		
		let p = wrapper.find(Draggable).findAll(IndexItem).at(0).find(Draggable);

		p.vm.$emit('change', {added: {element: index[1].children[0], oldIndex: 0, newIndex: 1}});

		expect(index[0].children[0].position).toBe(0);
		expect(index[0].children[1].position).toBe(1);
	})

	it ('updates the position of the items when the nested draggable emits a change:moved event', () => {
		bootstrapWrapper();

		expect(index[0].children.length).toBe(2);
		expect(index[0].children[0].position).toBe(1);
		expect(index[0].children[1].position).toBe(2);

		let p = wrapper.find(Draggable).findAll(IndexItem).at(0).find(Draggable);

		p.vm.$emit('change', {moved: {element: index[0].children[1], oldIndex: 1, newIndex: 0}});

		expect(index[0].children.length).toBe(2);
		expect(index[0].children[0].position).toBe(0);
		expect(index[0].children[1].position).toBe(1);
	})

	it ('displays a button to edit the page', () => {
		bootstrapWrapper();

		ui.seeElement('li.index_1 span.edit');
	})

	it ('displays a button to remove the page', () => {
		bootstrapWrapper();

		ui.seeElement('li.index_1 span.del');
	})

	it ('displays a button to toggle page visibility', () => {
		bootstrapWrapper();

		ui.seeElement('li.index_1 span.visibility');
		ui.see('Hide', 'li.index_1');
	})

	it ('emits an event when the edit button is clicked', () => {
		bootstrapWrapper();

		ui.notExpectEvent('edit');

		ui.click('li.index_1 span.edit');

		ui.expectEvent('edit');
		ui.expectEventData('edit', [index[0]]);
	})

	it ('emits an event when the visibility button is clicked', () => {
		bootstrapWrapper();

		ui.notExpectEvent('toggle');

		ui.click('li.index_1 span.visibility');

		ui.expectEvent('toggle');
		ui.expectEventData('toggle', [index[0]]);
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