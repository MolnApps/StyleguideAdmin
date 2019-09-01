import { mount, shallowMount } from '@vue/test-utils'
import PeopleEditor from '@/components/PeopleEditor.vue'
import PersonForm from '@/components/PersonForm.vue'
import {TestHelper, AjaxHelper, StateHelper} from './../helpers/Helpers.js'

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('PeopleEditor.vue', () => {
	let wrapper;
	let ui;
	let ajaxHelper;
	let returnedRecord;
	let store;

	beforeEach(() => {
		store = stateHelper.freshStore();

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
		ui.seeElement('div[data-id="1"] .edit');
		ui.seeElement('div[data-id="2"] .edit');
	})

	it ('displays a button to remove a person', () => {
		ui.seeElement('div[data-id="1"] .del');
		ui.seeElement('div[data-id="2"] .del');
	})

	it ('displays a button to add a person', () => {
		ui.seeButton('$add');
	})

	it ('displays a form when the add button is clicked', () => {
		ui.notSeeForm('#personForm');

		ui.click('$add');

		ui.seeForm('#personForm');
	})

	it ('displays a form when the edit button is clicked', () => {
		ui.notSeeForm('#personForm');

		ui.click('div[data-id="2"] .edit');

		ui.seeForm('#personForm[data-id="2"]');
	})

	it ('hides the list when the edit button is clicked', () => {
		ui.seeButton('$add');
		ui.seeButton('$cancelChanges');
		ui.seeButton('$saveChanges');

		ui.click('div[data-id="2"] .edit');

		ui.notSeeButton('$add');
		ui.notSeeButton('$cancelChanges');
		ui.notSeeButton('$saveChanges');
	})

	it ('removes the person from the list when the remove button is clicked', () => {
		ui.see('John Doe');
		ui.see('Jane Doe');

		ui.click('div[data-id="2"] .del');

		ui.see('John Doe');
		ui.notSee('Jane Doe')
	})

	it ('displays a button to save the changes', () => {
		ui.seeButton('$saveChanges');
	})

	it ('displays a button to cancel the changes', () => {
		ui.seeButton('$cancelChanges');
	})

	it ('performs an api call when the save changes button is clicked', (done) => {
		mockSuccessfullRequest();

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/pages/1/people', {
				person_id: [1, 2]
			})
		}, done);
	})

	it ('displays a feedback after a successful api call', (done) => {
		mockSuccessfullRequest();

		ui.notSeeFeedback();

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeFeedback();
		}, done);
	})

	it ('does not perform an api call when the cancel button is clicked', () => {
		ui.click('$cancelChanges');

		ajaxHelper.expectNoRequests();
	})

	it ('emits an event when the save changes button is clicked', (done) => {
		mockSuccessfullRequest();

		ui.notExpectEvent('success');

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('emits an event when the cancel changes button is clicked', () => {
		ui.notExpectEvent('cancel');

		ui.click('$cancelChanges');

		ui.expectEvent('cancel');
	})

	it ('hides the form on cancel', () => {
		ui.click('div[data-id="2"] .edit');

		ui.seeForm('#personForm');

		wrapper.find(PersonForm).vm.$emit('cancel');

		ui.notSeeForm('#personForm');
	})

	it ('hides the form and adds the new record to the list after a successful api call', () => {
		ui.click('div[data-id="2"] .edit');

		ui.seeForm('#personForm');

		wrapper.find(PersonForm).vm.$emit('success', returnedRecord);

		ui.notSeeForm('#personForm');
	})

	it ('adds a new person to the form after a successful api call', () => {
		ui.see('John Doe');
		ui.see('Jane Doe');
		ui.notSee('Robert Redford')

		ui.click('$add');

		wrapper.find(PersonForm).vm.$emit('success', returnedRecord);

		ui.see('John Doe');
		ui.see('Jane Doe');
		ui.see('Robert Redford')
	})

	it ('will not add an edited person to the form after a successful api call', () => {
		ui.see('John Doe');
		ui.see('Jane Doe');
		ui.notSee('Robert Redford');

		returnedRecord.id = 2;

		ui.click('div[data-id="2"] .edit');

		wrapper.find(PersonForm).vm.$emit('success', returnedRecord);

		ui.see('John Doe');
		ui.notSee('Jane Doe');
		ui.see('Robert Redford')
	})

	let bootstrapComponent = () => {
		returnedRecord = {
			id: 15, 
			first_name: 'Robert', 
			middle_name: '', 
			last_name: 'Redford', 
			full_name: 'Robert Redford', 
			job_title: 'Actor'
		};

		wrapper = mount(PeopleEditor, {
			localVue,
			store,
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