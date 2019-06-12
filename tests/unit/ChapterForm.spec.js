import { shallowMount } from '@vue/test-utils'
import ChapterForm from '@/components/ChapterForm.vue'
import {TestHelper, AjaxHelper} from './../helpers/Helpers.js'

describe('ChapterForm.vue', () => {
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
		
		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/pages/1', {
				title: 'Foobar'
			});
			ui.see('The page was updated.');
		}, done);
	})

	it('displays validation errors', (done) => {
		bootstrapWrapper();

		mockRequestWithValidationErrors();

	    ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.see('Title is required');
		}, done);
	})

	it ('triggers an event when the form is submitted', (done) => {
		bootstrapWrapper();

		let record = { id: '12', title: 'Foobar', body: '' };

		mockSuccessfullRequest(record);

		ui.notExpectEvent('success');

		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
			ui.expectEventData('success', [record]);
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

	let bootstrapWrapper = (page) => {
		page = page ? page : {id: '1', title:'Foo', body: ''};

		wrapper = shallowMount(ChapterForm, {
			propsData: {
				dataPage: page,
				dataEndpoint: '/pages'
			}
		});

		ui = new TestHelper(wrapper);
	}

	let mockSuccessfullRequest = (record, override) => {
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