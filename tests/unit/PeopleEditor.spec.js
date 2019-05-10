import { mount, shallowMount } from '@vue/test-utils'
import PeopleEditor from '@/components/PeopleEditor.vue'
import PersonForm from '@/components/PersonForm.vue'
import {TestHelper, AjaxHelper} from './../helpers/Helpers.js'

describe('PeopleEditor.vue', () => {
	let wrapper;
	let ui;
	let ajaxHelper;

	beforeEach(() => {
		ajaxHelper = new AjaxHelper();

	    ajaxHelper.install();

	    bootstrapComponent();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
    })

	it ('displays a list of people associated with the page', () => {
		ui.see('John Doe');
		ui.see('Jane Doe');
	})

	it ('displays a button to edit a person', () => {
		ui.seeElement('div[data-id="1"] span.edit');
		ui.seeElement('div[data-id="2"] span.edit');
	})

	it ('displays a button to remove a person', () => {
		ui.seeElement('div[data-id="1"] span.del');
		ui.seeElement('div[data-id="2"] span.del');
	})

	it ('displays a button to add a person', () => {
		ui.seeInput('button[id="add"]');
	})

	it ('displays a form when the add button is clicked', () => {
		ui.notSeeForm('#personForm');

		ui.click('#add');

		ui.seeForm('#personForm');
	})

	it ('displays a form when the edit button is clicked', () => {
		ui.notSeeForm('#personForm');

		ui.click('div[data-id="2"] span.edit');

		ui.seeForm('#personForm[data-id="2"]');
	})

	it ('hides the list when the edit button is clicked', () => {
		ui.seeInput('button[id="add"]');
		ui.seeInput('button[id="cancelChanges"]');
		ui.seeInput('button[id="saveChanges"]');

		ui.click('div[data-id="2"] span.edit');

		ui.notSeeInput('button[id="add"]');
		ui.notSeeInput('button[id="cancelChanges"]');
		ui.notSeeInput('button[id="saveChanges"]');
	})

	it ('removes the person from the list when the remove button is clicked', () => {
		ui.see('John Doe');
		ui.see('Jane Doe');

		ui.click('div[data-id="2"] span.del');

		ui.see('John Doe');
		ui.notSee('Jane Doe')
	})

	it ('displays a button to save the changes', () => {
		ui.seeInput('button[id="saveChanges"]');
	})

	it ('displays a button to cancel the changes', () => {
		ui.seeInput('button[id="cancelChanges"]');
	})

	it ('performs an api call when the save changes button is clicked', (done) => {
		mockSuccessfullRequest();

		ui.click('#saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/pages/1/people', {
				person_id: [1, 2]
			})
		}, done);
	})

	it ('does not perform an api call when the cancel button is clicked', () => {
		ui.click('#cancelChanges');

		ajaxHelper.expectNoRequests();
	})

	it ('emits an event when the save changes button is clicked', (done) => {
		mockSuccessfullRequest();

		ui.notExpectEvent('success');

		ui.click('#saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('emits an event when the cancel changes button is clicked', () => {
		ui.notExpectEvent('cancel');

		ui.click('#cancelChanges');

		ui.expectEvent('cancel');
	})

	it ('hides the form on cancel', () => {
		ui.click('div[data-id="2"] span.edit');

		ui.seeForm('#personForm');

		ui.click('#cancel');

		ui.notSeeForm('#personForm');
	})

	it ('hides the form after a successful api call', () => {
		ui.click('div[data-id="2"] span.edit');

		ui.seeForm('#personForm');

		wrapper.find(PersonForm).vm.$emit('success');

		ui.notSeeForm('#personForm');
	})

	let bootstrapComponent = () => {
		wrapper = mount(PeopleEditor, {
			propsData: { 
				dataPagePeople: [
					{id: 1, first_name: 'John', middle_name: '', last_name: 'Doe', full_name: 'John Doe', job_title: 'Founder'},
					{id: 2, first_name: 'Jane', middle_name: '', last_name: 'Doe', full_name: 'Jane Doe', job_title: 'SVP Marketing'}
				], 
				dataEndpoint: '/pages/1/people',
			}
		});

		ui = new TestHelper(wrapper);
	}

	let mockSuccessfullRequest = (record, override) => {
		ajaxHelper.stubRequest(/people/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/people/, ajaxHelper.getResponseWithValidationErrors({}));
	}
})