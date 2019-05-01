import { shallowMount } from '@vue/test-utils'
import PageForm from '@/components/PageForm.vue'
import moxios from 'moxios'
import TestUI from '@/TestHelpers.js'

describe('PageForm.vue', () => {
	let wrapper;
	let ui;

	beforeEach(() => {
		wrapper = shallowMount(PageForm, {
			propsData: { 
				dataPage: {title:'Foo', body: 'Bar'}
			}
	    });

	    moxios.install();

	    ui = new TestUI(wrapper);
	})

	afterEach(() => {
		moxios.uninstall();
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

		expectAfterRequest(() => {
			ui.see('The page was updated.');
		}, done);
	})

	it('displays validation errors', (done) => {
		mockRequestWithValidationErrors();

	    ui.click('#save');

		expectAfterRequest(() => {
			ui.see('Title is required');
			ui.see('Body is required');
			ui.seeForm('#pageForm');
		}, done);
	})

	it('triggers an event when the form is submitted', (done) => {
		mockSuccessfullRequest();

		expect(wrapper.emitted().success).toBeFalsy()

		ui.click('#save');

		expectAfterRequest(() => {
			expect(wrapper.emitted().success).toBeTruthy()
			expect(wrapper.emitted().success[0]).toEqual([{ title: 'Foo', body: 'Bar' }])
		}, done);
	})

	it('does not trigger an event if validation errors are present', (done) => {
		mockRequestWithValidationErrors();

		ui.click('#save');

		expectAfterRequest(() => {
			expect(wrapper.emitted().success).toBeFalsy()
		}, done);
	})

	it('triggers an event when the cancel button is clicked', () => {
		ui.click('#cancel');

		expect(wrapper.emitted().cancel).toBeTruthy()
	})

	let mockSuccessfullRequest = () => {
		moxios.stubRequest('/pages/1', {
			status: 200,
			responseText: {
				feedback: ['The page was updated.']
			}
		});
	}

	let mockRequestWithValidationErrors = () => {
		moxios.stubRequest('/pages/1', {
			status: 403,
			responseText: {
				errors: {
					title: ['Title is required'],
					body: ['Body is required']
				}
			}
		});
	}

	let expectAfterRequest = (callback, done) => {
		moxios.wait(() => {
			callback();
			done();
		});
	}
})