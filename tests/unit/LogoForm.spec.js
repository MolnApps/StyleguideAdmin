import { mount, shallowMount } from '@vue/test-utils'
import LogoForm from '@/components/LogoForm.vue'
import {TestHelper, AjaxHelper, LogoHelper, StateHelper} from './../helpers/Helpers.js'
import moxios from 'moxios';

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('LogoForm.vue', () => {
	let wrapper;
	let ui;
	let logoHelper;
	let ajaxHelper;
	let store;

	beforeEach(() => {
		store = stateHelper.freshStore();

		logoHelper = new LogoHelper();

		ajaxHelper = new AjaxHelper();

	    ajaxHelper.install();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
    })

    it ('presents a form', () => {
		bootstrapWrapper()

		ui.seeForm('#logoForm');
		ui.seeInput('input[name="title"]', 'Primary logo');
		ui.seeInput('input[type="file"][name="file"]', '');
	})

	it ('display a save button', () => {
		bootstrapWrapper();

		ui.seeButton('$save');
	})

	it ('display a cancel button', () => {
		bootstrapWrapper();

		ui.seeButton('$cancel');
	})

	it ('performs an api call when the save button is clicked', (done) => {
		bootstrapWrapper();

		let logo = logoHelper.make('My logo', {id: '2'});

		mockSuccessfullRequest(logo);

		ui.type('input[name="title"]', logo.title);
		
		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/logos/2', {
				title: 'My logo'
			});
		}, done);
	})

	it ('emits an event when the save button is clicked', (done) => {
		bootstrapWrapper();

		let logo = logoHelper.make('My logo', {id: 2});

		mockSuccessfullRequest(logo);

		ui.type('input[name="title"]', logo.title);
		
		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
			ui.expectEventData('success', [{
				data: {
					feedback: ['The page was updated.'],
					record: logo
				}, 
				id: 2
			}]);
		}, done);
	})

	it ('displays feedback when the save button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.notSeeFeedback();

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeFeedback();
		}, done);
	})

	it ('displays validation errors', (done) => {
		bootstrapWrapper();

		mockRequestWithValidationErrors();

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.see('Title is required');
			ui.see('Please provide a file');
		}, done);
	})

	it ('resets the form when the save button is clicked', (done) => {
		bootstrapWrapper(logoHelper.make(''));

		let logo = logoHelper.make('My logo', {id: 2});

		mockSuccessfullRequest(logoHelper.make('My logo returned'));

		ui.type('input[name="title"]', logo.title);

		ui.seeInput('input[name="title"]', logo.title);
		
		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeInput('input[name="title"]', 'My logo returned');
		}, done);
	})

	it ('emits an event when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.click('$cancel');

		ui.expectEvent('cancel');
	})

	it ('does not make any api call when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.click('$cancel');

		ajaxHelper.expectNoRequests();
	})

	it ('resets the form when the cancel button is clicked', (done) => {
		bootstrapWrapper(logoHelper.make(''));

		let logo = logoHelper.make('My logo', {id: 2});

		mockSuccessfullRequest(logo);

		ui.type('input[name="title"]', logo.title);
		
		ui.click('$cancel');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeInput('input[name="title"]', '');
		}, done);
	})

	let bootstrapWrapper = (logo) => {
		logo = logo 
			? logo 
			: logoHelper.make('Primary logo', {id: 2});

		wrapper = shallowMount(LogoForm, {
			localVue,
			store,
			propsData: { 
				dataLogo: logo, 
				dataEndpoint: '/logos'
			}
		});

	    ui = new TestHelper(wrapper);

	    logoHelper.setWrapper(wrapper).setTestHelper(ui);
	}

	let mockSuccessfullRequest = (record, override) => {
		record = record
			? record
			: logoHelper.make('Returned logo', {id: 15});

		ajaxHelper.stubRequest(/logos/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/logos/, ajaxHelper.getResponseWithValidationErrors({
			title: ['Title is required'],
			file: ['Please provide a file']
		}));
	}
})