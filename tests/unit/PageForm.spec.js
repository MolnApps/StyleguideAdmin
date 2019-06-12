import { shallowMount } from '@vue/test-utils'
import PageForm from '@/components/PageForm.vue'
import {TestHelper, AjaxHelper} from './../helpers/Helpers.js'

describe('PageForm.vue', () => {
	let wrapper;
	let ui;
	let ajaxHelper;

	beforeEach(() => {
		ajaxHelper = new AjaxHelper();
	    ajaxHelper.install();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
    })

	it('displays an empty form', () => {
		bootstrapWrapper({id: '', title: '', body: ''});

		ui.seeForm('#pageForm');
		ui.see('New page');
		ui.seeInput('input[name="title"]', '');
		ui.seeInput('textarea[name="body"]', '');
	})

	it ('displays a filled form if page is provided', () => {
		bootstrapWrapper();
		
	    ui.seeForm('#pageForm');
		ui.see('Edit page');
		ui.seeInput('input[name="title"]', 'Foo');
		ui.seeInput('textarea[name="body"]', 'Bar');
	})

	it('calls the api when the save button is clicked', (done) => {
		bootstrapWrapper();

		ui.type('input[name="title"]', 'Foobar');
		ui.type('textarea[name="body"]', 'Barbaz');

		mockSuccessfullRequest();
		
		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/pages/1', {
				id: '1', 
				title:'Foobar', 
				body: 'Barbaz'
			});
		}, done);
	})

	it ('displays feedback after successful api call', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();
		
		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.see('The page was updated.');
		}, done);
	})

	it('displays validation errors', (done) => {
		bootstrapWrapper();

		mockRequestWithValidationErrors();

	    ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.see('Title is required');
			ui.see('Body is required');
		}, done);
	})

	it('triggers an event when the form is submitted', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.notExpectEvent('success');

		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
			ui.expectEventData('success', [{ id: 12, title: 'Barfoo', body: 'Bazbar' }]);
		}, done);
	})

	it('does not trigger an event if validation errors are present', (done) => {
		bootstrapWrapper();

		mockRequestWithValidationErrors();

		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.notExpectEvent('success');
		}, done);
	})

	it('triggers an event when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.click('#cancel');

		ui.expectEvent('cancel');
	})

	it ('resets the form when the save button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.seeInput('input[name="title"]', 'Foo');
		ui.seeInput('textarea[name="body"]', 'Bar');
		
		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeInput('input[name="title"]', 'Barfoo');
			ui.seeInput('textarea[name="body"]', 'Bazbar');
		}, done);
	})

	it ('resets the form when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.seeInput('input[name="title"]', 'Foo');
		ui.seeInput('textarea[name="body"]', 'Bar');

		ui.type('input[name="title"]', 'Foobar');
		ui.type('textarea[name="body"]', 'Barbaz');

		ui.seeInput('input[name="title"]', 'Foobar');
		ui.seeInput('textarea[name="body"]', 'Barbaz');
		
		ui.click('#cancel');

		ui.seeInput('input[name="title"]', 'Foo');
		ui.seeInput('textarea[name="body"]', 'Bar');
	})

	let bootstrapWrapper = (page) => {
		page = page ? page : {id: '1', title:'Foo', body: 'Bar'};

		wrapper = shallowMount(PageForm, {
			propsData: {
				dataPage: page,
				dataEndpoint: '/pages'
			}
		});

		ui = new TestHelper(wrapper);
	}

	let mockSuccessfullRequest = (record, override) => {
		record = record ? record : {
			id: 12,
			title: 'Barfoo',
			body: 'Bazbar'
		};

		ajaxHelper.stubRequest(
			/pages\/\d+/, 
			ajaxHelper.getSuccessfulResponse(record, override)
		);
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(
			/pages\/\d+/, 
			ajaxHelper.getResponseWithValidationErrors({
				title: ['Title is required'],
				body: ['Body is required']
			})
		);
	}
})