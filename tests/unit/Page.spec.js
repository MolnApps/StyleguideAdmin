import { shallowMount } from '@vue/test-utils'
import Page from '@/components/Page.vue'
import moxios from 'moxios'
import TestUI from './../../src/TestHelpers.js'

describe('Page.vue', () => {
	let wrapper;
	let ui;

	beforeEach(() => {
		wrapper = shallowMount(Page, {
			propsData: { 
				dataPage: {title:'Foo', body: 'Bar'},
				dataForm: null
			}
	    });

	    moxios.install();

	    ui = new TestUI(wrapper);
	})

	afterEach(() => {
		moxios.uninstall();
    })

	it('displays a page markup', () => {
		ui.see('Foo');
		ui.see('Bar');
	})

	it('displays a edit button', () => {
		ui.seeInput('#edit');
	})

	it('displays a form when the edit button is clicked', () => {
		ui.notSeeForm('#pageForm');

		ui.click('#edit');

		ui.seeForm('#pageForm');
	})

	it('has all inputs', () => {
		ui.click('#edit');

		ui.seeInput('input[name="title"]', 'Foo');
		ui.seeInput('textarea[name="body"]', 'Bar');
	})

	it('hides the form when the save button is clicked', (done) => {
		ui.click('#edit');

		ui.seeForm('#pageForm');

		mockSuccessfullRequest();
		
		ui.click('#save');

		expectAfterRequest(() => {
			ui.notSeeForm('#pageForm');	
		}, done);
	})

	it('updates the page when the save button is clicked', (done) => {
		ui.notSee('Foobar');
		ui.notSee('Barbaz');

		ui.click('#edit');

		ui.type('input[name="title"]', 'Foobar');
		ui.type('textarea[name="body"]', 'Barbaz');

		mockSuccessfullRequest();
		
		ui.click('#save');

		expectAfterRequest(() => {
			ui.see('Foobar');
			ui.see('Barbaz');
		}, done);
	})

	it('does not update the page when the cancel button is clicked', () => {
		ui.notSee('Foobar');
		ui.notSee('Barbaz');

		ui.click('#edit');

		ui.type('input[name="title"]', 'Foobar');
		ui.type('textarea[name="body"]', 'Barbaz');

		ui.click('#cancel');

		ui.notSee('Foobar');
		ui.notSee('Barbaz');
	})

	it('calls the api when the save button is clicked', (done) => {
		ui.click('#edit');

		ui.type('input[name="title"]', 'Foobar');
		ui.type('textarea[name="body"]', 'Barbaz');

		mockSuccessfullRequest();
		
		ui.click('#save');

		expectAfterRequest(() => {
			ui.see('The page was updated.');
		}, done);
	})

	it('displays validation errors', (done) => {
		ui.click('#edit');

		moxios.stubRequest('/pages/1', {
			status: 403,
			responseText: {
				errors: {
					title: ['Title is required'],
					body: ['Body is required']
				}
			}
		});

	    ui.click('#save');

		expectAfterRequest(() => {
			ui.see('Title is required');
			ui.see('Body is required');
			ui.seeForm('#pageForm');
		}, done);
	})

	let mockSuccessfullRequest = () => {
		moxios.stubRequest('/pages/1', {
			status: 200,
			responseText: {
				feedback: ['The page was updated.']
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
