import { mount, shallowMount } from '@vue/test-utils'
import IndexEditor from '@/components/IndexEditor.vue'
import PageForm from '@/components/PageForm.vue'
import PageSteps from '@/components/PageSteps.vue'
import {TestHelper, AjaxHelper, IndexHelper, StateHelper} from './../helpers/Helpers.js'
import Draggable from 'vuedraggable'

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('IndexEditor.vue', () => {
	let wrapper;
	let ui;
	let ajaxHelper;
	let indexHelper;
	let store;

	beforeEach(() => {
		store = stateHelper.freshStore();

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
					{id: 1, page_id: 1, parent_id: null, position: 0},
					{id: 2, page_id: 2, parent_id: 1, position: 1},
					{id: 3, page_id: 3, parent_id: 1, position: 2},
					{id: 4, page_id: 4, parent_id: null, position: 3},
					{id: 5, page_id: 5, parent_id: 4, position: 4}
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
			ui.seeFeedback('The index could not be updated.');
		}, done);
	})

	it ('displays the page form when the edit button is clicked', () => {
		bootstrapWrapper();

		ui.notSeeForm('#pageForm');

		ui.click('li.index_2 .edit');

		ui.seeForm('#pageForm[data-id="2"]');
	})

	it ('hides the list when the form is visible', () => {
		bootstrapWrapper();

		ui.seeElement('#editor');

		ui.click('li.index_2 .edit');

		ui.notSeeElement('#editor');
	})

	it ('displays a button to add a page', () => {
		bootstrapWrapper();

		ui.seeButton('$add');
	})

	it ('displays the page steps when the add button is clicked', () => {
		bootstrapWrapper();

		ui.notSeeElement('#pageSteps');

		ui.click('$add');

		ui.seeElement('#pageSteps');
	})

	it ('hides the page steps when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.click('$add');

		ui.seeElement('#pageSteps');

		wrapper.find(PageSteps).vm.$emit('cancel');

		ui.notSeeElement('#pageSteps')
	})

	it ('hides the page steps after a successful api call', () => {
		bootstrapWrapper();

		ui.click('$add');

		ui.seeElement('#pageSteps');

		wrapper.find(PageSteps).vm.$emit('success');

		ui.notSeeElement('#pageSteps')
	})

	it ('removes the page when the remove button is clicked', () => {
		bootstrapWrapper();

		ui.see('About us');

		ui.click('li.index_2 .del');

		ui.notSee('About us');
	})

	it ('removes the page but not its children when the remove button is clicked', () => {
		bootstrapWrapper();

		ui.see('My chapter');
		ui.see('About us');

		ui.click('li.index_1 .del');

		ui.notSee('My chapter');
		ui.see('About us');
	})

	it ('resets the children position and parent id of a deleted page', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.click('li.index_1 .del');

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/index', {
				index: [
					{id: 4, page_id: 4, parent_id: null, position: 0},
					{id: 5, page_id: 5, parent_id: 4, position: 4},
					{id: 2, page_id: 2, parent_id: null, position: 1},
					{id: 3, page_id: 3, parent_id: null, position: 2},
				]
			})
		}, done)
	})

	it ('makes an api call when the visibility button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullToggleRequest();

		ui.click('li.index_1 .visibility');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('toggleSuccess');
			ui.seeFeedback();
		}, done);
	})

	it ('adds a page to the list after a successful api call', () => {
		bootstrapWrapper();

		ui.notSee('Lorem ipsum');

		ui.click('$add');

		wrapper.find(PageSteps).vm.$emit('success', {
			id: 12, 
			title: 'Lorem ipsum', 
			body: '', 
			type: '', 
			component: ''
		});

		ui.see('Lorem ipsum');
	})

	it ('will not throw an error if save changes button is clicked after adding a page', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.click('$add');

		wrapper.find(PageSteps).vm.$emit('success', {
			id: 12, 
			title: 'Lorem ipsum', 
			body: '', 
			type: '', 
			component: ''
		});

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/index', {
				index: [
					{id: 1, page_id: 1, parent_id: null, position: 0},
					{id: 2, page_id: 2, parent_id: 1, position: 1},
					{id: 3, page_id: 3, parent_id: 1, position: 2},
					{id: 4, page_id: 4, parent_id: null, position: 3},
					{id: 5, page_id: 5, parent_id: 4, position: 4},
					{id: null, page_id: 12, parent_id: null, position: 0},
				]
			});
		}, done);
	})

	it ('does not add a new item to the list after a successful api call if editing', () => {
		bootstrapWrapper();

		ui.see('About us');
		ui.notSee('Lorem ipsum');

		ui.click('li.index_2 .edit');

		wrapper.find(PageForm).vm.$emit('success', {
			id: 12, 
			title: 'Lorem ipsum', 
			body: '', 
			type: '', 
			component: ''
		});

		ui.notSee('About us');
		ui.see('Lorem ipsum');
	})

	it ('displays a button to save changes', () => {
		ui.seeButton('$saveChanges');
	})

	it ('displays a button to cancel changes', () => {
		ui.seeButton('$cancelChanges');
	})

	it ('performs an api call if the save changes button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/index', {
				index: [
					{id: 1, page_id: 1, parent_id: null, position: 0},
					{id: 2, page_id: 2, parent_id: 1, position: 1},
					{id: 3, page_id: 3, parent_id: 1, position: 2},
					{id: 4, page_id: 4, parent_id: null, position: 3},
					{id: 5, page_id: 5, parent_id: 4, position: 4}
				]
			});
		}, done);
	})

	it ('emits an event after a successful api call', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.notExpectEvent('success');

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('emits an event when cancel changes button is clicked', () => {
		bootstrapWrapper();

		ui.notExpectEvent('cancel');

		ui.click('$cancelChanges');

		ui.expectEvent('cancel');
	})

	let bootstrapWrapper = () => {
		let index = indexHelper.makeStructure();

		wrapper = mount(IndexEditor, {
			localVue,
			store,
			propsData: {
				dataIndex: index,
				dataEndpoint: '/index',
				dataToggleEndpoint: '/pages/toggle'
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

	let mockSuccessfullToggleRequest = (record, override) => {
		ajaxHelper.stubRequest(
			/pages/, 
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