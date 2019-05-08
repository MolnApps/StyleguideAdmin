import { mount, shallowMount } from '@vue/test-utils'
import IndexEditor from '@/components/IndexEditor.vue'
import {TestHelper, AjaxHelper, IndexHelper} from './../helpers/Helpers.js'
import Draggable from 'vuedraggable'

describe('IndexEditor.vue', () => {
	let wrapper;
	let ui;
	let ajaxHelper;
	let indexHelper;

	beforeEach(() => {
		indexHelper = new IndexHelper();

		ajaxHelper = new AjaxHelper();
	    ajaxHelper.install();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
    })

	it ('can be instantiated', () => {
		bootstrapWrapper();
	})

	it ('it presents a list of pages', () => {
		bootstrapWrapper();

		ui.see('My chapter', '.index_1');
		ui.see('About us', '.container_1 .index_2');
		ui.see('Mission', '.container_1 .index_3');
		ui.see('Another chapter', '.index_4');
		ui.see('Foobar', '.container_4 .index_5');
	})

	it ('the list items are draggable', () => {
		bootstrapWrapper();

		expect(wrapper.find(Draggable).exists()).toBe(true);
	})

	it ('makes an api call when the list is updated', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		wrapper.find(Draggable).vm.$emit('end');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/index', {
				index: [
					{id: 1, parent_id: null, position: 0},
					{id: 2, parent_id: 1, position: 1},
					{id: 3, parent_id: 1, position: 2},
					{id: 4, parent_id: null, position: 3},
					{id: 5, parent_id: 4, position: 4}
				]
			});
		}, done);
	})

	it ('emits an event when the api call is successful', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		wrapper.find(Draggable).vm.$emit('end');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('displays the error message if the api call is not successful', (done) => {
		bootstrapWrapper();

		mockRequestWithErrors();

		wrapper.find(Draggable).vm.$emit('end');

		ajaxHelper.expectAfterRequest(() => {
			ui.see('The index could not be updated.');
		}, done);
	})

	let bootstrapWrapper = () => {
		let index = indexHelper.makeStructure();

		wrapper = mount(IndexEditor, {
			propsData: {
				dataIndex: index,
				dataEndpoint: '/index'
			}
		});

		ui = new TestHelper(wrapper);

		indexHelper.setTestHelper(ui).setWrapper(wrapper);
	}

	let mockSuccessfullRequest = (record, override) => {
		ajaxHelper.stubRequest(
			/index/, 
			ajaxHelper.getSuccessfulResponse(record, override)
		);
	}

	let mockRequestWithErrors = () => {
		ajaxHelper.stubRequest(
			/index/, 
			ajaxHelper.getResponseWithErrors('The index could not be updated.')
		);
	}
})