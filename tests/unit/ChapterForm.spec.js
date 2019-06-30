import { mount, shallowMount } from '@vue/test-utils'
import ChapterForm from '@/components/ChapterForm.vue'
import {TestHelper, AjaxHelper, StateHelper} from './../helpers/Helpers.js'

import Notifications from 'vue-notification'

import Btn from '@/components/Btn'

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('ChapterForm.vue', () => {
	let wrapper;
	let ui;
	let ajaxHelper;
	let store;

	beforeEach(() => {
		store = stateHelper.freshStore();
		ajaxHelper = new AjaxHelper();
	    ajaxHelper.install();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
		stateHelper.uninstall();
    })

	it ('displays an empty form', () => {
		bootstrapWrapper({id: '', title:'', body: ''});

	    ui.seeForm('#chapterForm');
		ui.see('New chapter');
		ui.seeInput('input[name="title"]', '');
	})

	it ('displays a filled form if page is provided', () => {
		bootstrapWrapper();
		
	    ui.seeForm('#chapterForm');
		ui.see('Edit chapter');
		ui.seeInput('input[name="title"]', 'Foo');
	})

	it ('calls the api when the save button is clicked', (done) => {
		bootstrapWrapper();

	    ui.type('input[name="title"]', 'Foobar');

		mockSuccessfullRequest();
		
		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/pages/1', {
				title: 'Foobar'
			});
		}, done);
	})

	it ('displays feedback after a successful api call', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		stateHelper.notSeeFeedback();
		
		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			stateHelper.seeFeedback();
		}, done);
	})

	it('displays validation errors', (done) => {
		bootstrapWrapper();

		mockRequestWithValidationErrors();

	    ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.see('Title is required');
		}, done);
	})

	it ('triggers an event when the form is submitted', (done) => {
		bootstrapWrapper();

		let returnedRecord = { id: '12', title: 'Foobar', body: '' };

		mockSuccessfullRequest(returnedRecord);

		ui.notExpectEvent('success');

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
			ui.expectEventData('success', [returnedRecord]);
		}, done);
	})

	it('does not trigger an event if validation errors are present', (done) => {
		bootstrapWrapper();

		mockRequestWithValidationErrors();

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.notExpectEvent('success');
		}, done);
	})

	it('triggers an event when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.click('$cancel');

		ui.expectEvent('cancel');
	})

	it ('resets the form when the save button is clicked', () => {
		
	})

	it('resets the form when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.seeInput('input[name="title"]', 'Foo');

		ui.type('input[name="title"]', 'Foobar');

		ui.seeInput('input[name="title"]', 'Foobar');

		ui.click('$cancel');

		ui.seeInput('input[name="title"]', 'Foo');
	})

	let bootstrapWrapper = (page) => {
		page = page ? page : {id: '1', title:'Foo', body: ''};

		wrapper = mount(ChapterForm, {
			localVue,
			store,
			propsData: {
				dataPage: page,
				dataEndpoint: '/pages'
			}
		});

		ui = new TestHelper(wrapper);
	}

	let mockSuccessfullRequest = (record, override) => {
		record = record
			? record
			: {id: 12, title: 'Foobar', body: ''};

		ajaxHelper.stubRequest(
			/pages\/\d+/, 
			ajaxHelper.getSuccessfulResponse(record, override)
		);
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(
			/pages\/\d+/, 
			ajaxHelper.getResponseWithValidationErrors({
				title: ['Title is required']
			})
		);
	}
})