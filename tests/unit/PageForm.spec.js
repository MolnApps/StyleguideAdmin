import { shallowMount } from '@vue/test-utils'
import PageForm from '@/components/PageForm.vue'
import {TestHelper, AjaxHelper} from './../helpers/Helpers.js'

describe('PageForm.vue', () => {
	let wrapper;
	let ui;
	let ajaxHelper;

	beforeEach(() => {
		wrapper = shallowMount(PageForm, {
			propsData: { 
				dataPage: {title:'Foo', body: 'Bar'},
				dataEndpoint: '/pages/1'
			}
	    });

	    ui = new TestHelper(wrapper);

	    ajaxHelper = new AjaxHelper();
	    ajaxHelper.install();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
    })

	it('displays a form', () => {
		ui.seeForm('#pageForm');
		ui.seeInput('input[name="title"]', 'Foo');
		ui.seeInput('textarea[name="body"]', 'Bar');
	})

	it('calls the api when the save button is clicked', (done) => {
		ui.type('input[name="title"]', 'Foobar');
		ui.type('textarea[name="body"]', 'Barbaz');

		mockSuccessfullRequest();
		
		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.see('The page was updated.');
		}, done);
	})

	it('displays validation errors', (done) => {
		mockRequestWithValidationErrors();

	    ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.see('Title is required');
			ui.see('Body is required');
			ui.seeForm('#pageForm');
		}, done);
	})

	it('triggers an event when the form is submitted', (done) => {
		mockSuccessfullRequest();

		ui.notExpectEvent('success');

		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
			ui.expectEventData('success', [{ title: 'Foo', body: 'Bar' }]);
		}, done);
	})

	it('does not trigger an event if validation errors are present', (done) => {
		mockRequestWithValidationErrors();

		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.notExpectEvent('success');
		}, done);
	})

	it('triggers an event when the cancel button is clicked', () => {
		ui.click('#cancel');

		ui.expectEvent('cancel');
	})

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
				title: ['Title is required'],
				body: ['Body is required']
			})
		);
	}
})