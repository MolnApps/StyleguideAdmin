import { mount, shallowMount } from '@vue/test-utils'
import PersonForm from '@/components/PersonForm.vue'
import {TestHelper, AjaxHelper, StateHelper} from './../helpers/Helpers.js'

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('PersonForm.vue', () => {
	let wrapper;
	let ui;
	let ajaxHelper;
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

	it ('displays an empty form if no person is passed', () => {
		bootstrapComponent({});

		ui.seeForm('#personForm');
		ui.seeInput('input[name="first_name"]', '');
		ui.seeInput('input[name="middle_name"]', '');
		ui.seeInput('input[name="last_name"]', '');
		ui.seeInput('input[name="job_title"]', '');
	})

	it ('displays a filled form if a person is passed', () => {
		ui.seeForm('#personForm');
		ui.seeInput('input[name="first_name"]', 'John');
		ui.seeInput('input[name="middle_name"]', 'Johnathan');
		ui.seeInput('input[name="last_name"]', 'Doe');
		ui.seeInput('input[name="job_title"]', 'Founder');
	})

	it ('displays a save button', () => {
		ui.seeButton('$save');
	})

	it ('displays a cancel button', () => {
		ui.seeButton('$cancel');
	})

	it ('performs an api call if the save button is clicked', (done) => {
		let person = {
			first_name: 'Robert',
			middle_name: 'Robertson',
			last_name: 'Redford',
			job_title: 'Actor'
		}

		mockSuccessfullRequest(person);

		ui.type('input[name="first_name"]', person.first_name);
		ui.type('input[name="middle_name"]', person.middle_name);
		ui.type('input[name="last_name"]', person.last_name);
		ui.type('input[name="job_title"]', person.job_title);
		
		ui.click('#add_email');
		ui.type('li[data-id="3"] input[name="value"]', 'john@example.com');

		ui.click('#add_telephone');
		ui.type('li[data-id="4"] input[name="prefix"]', '+1');
		ui.type('li[data-id="4"] input[name="number"]', '345 67 89 000');
		
		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/people/1', {
				first_name: person.first_name,
				middle_name: person.middle_name,
				last_name: person.last_name,
				job_title: person.job_title,
				contacts: [
					{id: 1, type: 'email', value: {value: 'info@example.com'}},
					{id: 2, type: 'telephone', value: {prefix: '+39', number: '000 00 00 000'}},
					{id: null, type: 'email', value: {value: 'john@example.com'}},
					{id: null, type: 'telephone', value: {prefix: '+1', number: '345 67 89 000'}}
				]
			})
		}, done);
	})

	it ('displays feedback if the api call is successful', (done) => {
		mockSuccessfullRequest();

		ui.notSeeFeedback();

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeFeedback();
		}, done);
	})

	it ('emits an event after the api call if successful', (done) => {
		let returnedRecord = {
			id: 1,
			first_name: 'John',
			middle_name: 'Johnson',
			last_name: 'Doe',
			job_title: 'Massmarket',
			contacts: []
		};
		
		mockSuccessfullRequest(returnedRecord);

		ui.notExpectEvent('success');

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
			ui.expectEventData('success', [returnedRecord])
		}, done);
	})

	it ('emits an event when the cancel button is clicked', () => {
		ui.notExpectEvent('cancel');
		
		ui.click('$cancel');
		
		ui.expectEvent('cancel');
	})

	it ('displays validation errors', (done) => {
		mockRequestWithValidationErrors();

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.see('Please provide a first name');
			ui.see('Please provide a middle name');
			ui.see('Please provide a last name');
			ui.see('Please provide a job title');
		}, done);
	})

	it ('does not emit any event in case of validation errors', (done) => {
		mockRequestWithValidationErrors();

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.notExpectEvent('success');
		}, done);
	})

	it ('resets the form when the save button is clicked', (done) => {
		mockSuccessfullRequest({
			first_name: 'Clint',
			middle_name: '',
			last_name: 'Eastwood',
			job_title: 'Head of badasses'
		});

		ui.type('input[name="first_name"]', 'Robert');
		ui.type('input[name="middle_name"]', 'Robertson');
		ui.type('input[name="last_name"]', 'Redford');
		ui.type('input[name="job_title"]', 'Actor');
		
		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeInput('input[name="first_name"]', 'Clint');
			ui.seeInput('input[name="middle_name"]', '');
			ui.seeInput('input[name="last_name"]', 'Eastwood');
			ui.seeInput('input[name="job_title"]', 'Head of badasses');
		}, done);
	})

	it ('resets the form when the cancel button is clicked', () => {
		mockSuccessfullRequest();

		ui.type('input[name="first_name"]', 'Robert');
		ui.type('input[name="middle_name"]', 'Robertson');
		ui.type('input[name="last_name"]', 'Redford');
		ui.type('input[name="job_title"]', 'Actor');
		
		ui.click('$cancel');

		ui.seeInput('input[name="first_name"]', 'John');
		ui.seeInput('input[name="middle_name"]', 'Johnathan');
		ui.seeInput('input[name="last_name"]', 'Doe');
		ui.seeInput('input[name="job_title"]', 'Founder');
	})

	it ('displays a list of contacts', () => {
		ui.seeInput('li[data-id="1"] input[name="value"]', 'info@example.com');
		ui.seeInput('li[data-id="2"] input[name="prefix"]', '+39');
		ui.seeInput('li[data-id="2"] input[name="number"]', '000 00 00 000');
	})

	it ('displays button to add a contact', () => {
		ui.seeInput('#add_email');
		ui.seeInput('button[id="add_telephone"]');
	})

	it ('displays a button to remove a contact', () => {
		ui.seeElement('li[data-id="1"] .del');
		ui.seeElement('li[data-id="2"] .del');
	})

	it ('removes a contact when the remove button is clicked', () => {
		ui.seeElement('li[data-id="1"]');
		ui.seeElement('li[data-id="2"]');

		ui.click('li[data-id="2"] .del');

		ui.seeElement('li[data-id="1"]');
		ui.notSeeElement('li[data-id="2"]');
	})

	it ('adds an email contact when the add email button is clicked', () => {
		ui.notSeeElement('li[data-id="3"]');

		ui.click('#add_email');

		ui.seeElement('li[data-id="3"]');
		ui.seeInput('li[data-id="3"] input[name="value"]');
	})

	it ('adds an email contact when the add email button is clicked', () => {
		ui.notSeeElement('li[data-id="3"]');

		ui.click('#add_telephone');

		ui.seeElement('li[data-id="3"]');
		ui.seeInput('li[data-id="3"] input[name="prefix"]');
		ui.seeInput('li[data-id="3"] input[name="number"]');
	})

	let bootstrapComponent = (person) => {
		person = person ? person : {
			id: 1, 
			first_name: 'John', 
			middle_name: 'Johnathan', 
			last_name: 'Doe', 
			full_name: 'John Doe', 
			job_title: 'Founder',
			contacts: [
				{id: 1, type: 'email', value: {value: 'info@example.com'}},
				{id: 2, type: 'telephone', value: {prefix: '+39', number: '000 00 00 000'}}
			]
		};
		wrapper = mount(PersonForm, {
			localVue,
	    	store,
			propsData: { 
				dataPerson: person, 
				dataEndpoint: '/people',
			}
		});

		ui = new TestHelper(wrapper);
	}

	let mockSuccessfullRequest = (record, override) => {
		record = record ? record : {
			id: 12,
			first_name: 'Robert',
			middle_name: 'Robertson',
			last_name: 'Redford',
			job_title: 'Actor'
		};

		ajaxHelper.stubRequest(/people/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/people/, ajaxHelper.getResponseWithValidationErrors({
			first_name: ['Please provide a first name'],
			middle_name: ['Please provide a middle name'],
			last_name: ['Please provide a last name'],
			job_title: ['Please provide a job title'],
		}));
	}
})