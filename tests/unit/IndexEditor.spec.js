import { mount, shallowMount } from '@vue/test-utils'
import IndexEditor from '@/components/IndexEditor.vue'
import PageForm from '@/components/PageForm.vue'
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

	it ('displays the page form when the edit button is clicked', () => {
		bootstrapWrapper();

		ui.notSeeForm('#pageForm');

		ui.click('li.index_2 span.edit');

		ui.seeForm('#pageForm[data-id="2"]');
	})

	it ('hides the list when the form is visible', () => {
		bootstrapWrapper();

		ui.seeElement('#editor');

		ui.click('li.index_2 span.edit');

		ui.notSeeElement('#editor');
	})

	it ('displays a button to add a page', () => {
		bootstrapWrapper();

		ui.seeInput('button[id="add"]');
	})

	it ('displays the form when the add button is clicked', () => {
		bootstrapWrapper();

		ui.notSeeForm('#pageForm');

		ui.click('#add');

		ui.seeForm('#pageForm');
	})

	it ('hides the form when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.click('#add');

		ui.seeForm('#pageForm')

		wrapper.find(PageForm).vm.$emit('cancel');

		ui.notSeeForm('#pageForm')
	})

	it ('hides the form after a successful api call', () => {
		bootstrapWrapper();

		ui.click('#add');

		ui.seeForm('#pageForm')

		wrapper.find(PageForm).vm.$emit('success');

		ui.notSeeForm('#pageForm')
	})

	it ('removes the page when the remove button is clicked', () => {
		bootstrapWrapper();

		ui.see('About us');

		ui.click('li.index_2 span.del');

		ui.notSee('About us');
	})

	it ('changes the button label when the visibility button is clicked', () => {
		bootstrapWrapper();

		ui.notSee('Publish');

		ui.click('li.index_1 span.visibility');

		ui.see('Publish', 'li.index_1');
	})

	it ('makes an api call when the visibility button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullToggleRequest();

		ui.click('li.index_1 span.visibility');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('toggleSuccess');
			ui.see('The page was updated');
		}, done);
	})

	it ('adds a page to the list after a successful api call', () => {
		bootstrapWrapper();

		ui.notSee('Lorem ipsum');

		ui.click('#add');

		wrapper.find(PageForm).vm.$emit('success', {
			record: {
				id: 12, 
				title: 'Lorem ipsum', 
				body: '', 
				type: '', 
				component: ''
			}
		});

		ui.see('Lorem ipsum');
	})

	it ('does not add a new item to the list after a successful api call if editing', () => {
		bootstrapWrapper();

		ui.see('About us');
		ui.notSee('Lorem ipsum');

		ui.click('li.index_2 span.edit');

		wrapper.find(PageForm).vm.$emit('success', {
			record: {
				id: 12, 
				title: 'Lorem ipsum', 
				body: '', 
				type: '', 
				component: ''
			}
		});

		ui.notSee('About us');
		ui.see('Lorem ipsum');
	})

	it ('displays a button to save changes', () => {
		ui.seeInput('button[id="saveChanges"]');
	})

	it ('displays a button to cancel changes', () => {
		ui.seeInput('button[id="cancelChanges"]');
	})

	it ('performs an api call if the save changes button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.click('#saveChanges');

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

	it ('emits an event after a successful api call', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.notExpectEvent('success');

		ui.click('#saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('emits an event when cancel changes button is clicked', () => {
		bootstrapWrapper();

		ui.notExpectEvent('cancel');

		ui.click('#cancelChanges');

		ui.expectEvent('cancel');
	})

	xit ('asks for confirmation before removing a page with children', () => {
		
	})

	let bootstrapWrapper = () => {
		let index = indexHelper.makeStructure();

		wrapper = mount(IndexEditor, {
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