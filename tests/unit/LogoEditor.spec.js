import { mount, shallowMount } from '@vue/test-utils'
import LogoEditor from '@/components/LogoEditor.vue'
import {TestHelper, AjaxHelper, LogoHelper} from './../helpers/Helpers.js'
import moxios from 'moxios';

describe('LogoEditor.vue', () => {
	let wrapper;
	let ui;
	let logoHelper;
	let ajaxHelper;

	beforeEach(() => {
		logoHelper = new LogoHelper(ui, wrapper);
	    ajaxHelper = new AjaxHelper();

	    ajaxHelper.install();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
    })

	it ('it shows all page logos and their background', () => {
		bootstrapWrapper()

		ui.seeElement('div.page div[data-id="1"][data-background="#ffffff"]');
		ui.seeElement('div.page div[data-id="1"][data-background="#000000"]');
	})

	it ('it shows all logos including the ones already associate with the page', () => {
		bootstrapWrapper()

		ui.seeElement('div.all div[data-id="1"]');
		ui.seeElement('div.all div[data-id="2"]');
		ui.seeElement('div.all div[data-id="3"]');
	})

	xit ('can arrange logos in a different order', () => {
		
	})

	it ('it presents a button to add a new logo', () => {
		bootstrapWrapper()

		ui.seeInput('button[id="add"]');
	})

	it ('presents a form when the add button is clicked', () => {
		bootstrapWrapper()

		ui.click('#add');

		ui.seeForm('#logoForm');
		ui.seeInput('input[name="title"]', '');
		ui.seeInput('input[type="file"][name="file"]', '');
		ui.seeInput('button[id="save"]', '');
	})

	it ('hides all other elements when the form is shown', () => {
		bootstrapWrapper()

		ui.click('#add');

		ui.notSeeElement('div.page');
		ui.notSeeElement('div.all');
		ui.notSeeElement('#add');
	})

	it ('if the form save button is clicked the logo is added to the page', (done) => {
		bootstrapWrapper();

		let logo = logoHelper.make('My logo', {url: ''});

		mockSuccessfullRequest(logo, {id: 25});

		ui.click('#add');

		ui.type('input[name="title"]', logo.title);
		// *** Here we must fake a file upload ***

		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/logos', logo);
			ui.seeElement('div[data-id="25"]');
		}, done);
	})

	it ('it displays validation errors for the form', (done) => {
		bootstrapWrapper();

		mockRequestWithValidationErrors();

		ui.click('#add');
		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeForm('#logoForm');

			ui.see('Title is required');
			ui.see('Please provide a file');
		}, done);
	})

	it ('resets the form when the save button is clicked', (done) => {
		bootstrapWrapper();

		let logo = logoHelper.make('My logo', {url: ''});

		mockSuccessfullRequest(logo, {id: 25});

		ui.click('#add');

		ui.type('input[name="title"]', logo.title);
		// *** Here we must fake a file upload ***

		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.click('#add');
			ui.seeInput('input[name="title"]', '');
		}, done);
	})

	it ('hides the form when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.click('#add');

		ui.seeForm('#logoForm');

		ui.click('#cancel');

		ui.notSeeForm('#logoForm');
	})

	xit ('will not affect previously added logos when multiple logos are added', () => {
		
	})

	it ('it edits a logo background', () => {
		bootstrapWrapper();

		ui.seeElement('div.page div[data-id="1"][data-background="#ffffff"]');
		ui.seeElement('div.page div[data-id="1"][data-background="#000000"]');

		ui.click('div.page div[data-id="1"][data-background="#000000"] span.edit');

		ui.seeForm('#logoBgForm');
		ui.seeInput('input[name="hex"]');
		ui.seeInput('button[id="save"]');

		ui.type('input[name="hex"]', '#ff0000');

		ui.click('#save');

		ui.notSeeForm('#logoBgForm');

		ui.seeElement('div.page div[data-id="1"][data-background="#ffffff"]');
		ui.seeElement('div.page div[data-id="1"][data-background="#ff0000"]');
	})

	it ('removes a logo', () => {
		bootstrapWrapper();

		ui.seeElement('div.page div[data-id="1"][data-background="#ffffff"]');
		ui.seeElement('div.page div[data-id="1"][data-background="#000000"]');

		ui.click('div.page div[data-id="1"][data-background="#000000"] span.del');

		ui.seeElement('div.page div[data-id="1"][data-background="#ffffff"]');
		ui.notSeeElement('div.page div[data-id="1"][data-background="#000000"]');
	})

	it ('adds a logo from the library on click', () => {
		bootstrapWrapper();

		ui.click('div.all div[data-id="2"]');
		
		ui.seeForm('#logoBgForm');
		ui.type('input[name="hex"]', '#0099ff');
		ui.click('#save');
		
		ui.seeElement('div.page div[data-id="2"][data-background="#0099ff"]');
	})

	it ('calls the api when the save changes button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		// Assuming I add a logo from the library
		ui.click('div.all div[data-id="2"]');

		ui.type('input[name="hex"]', '#0099ff');
		ui.click('#save');

		// And I remove a logo from the page
		ui.click('div.page div[data-id="1"][data-background="#000000"] span.del');

		// When I click the save changes button
		ui.click('#saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/pages/1/logos', {foo: 'bar'});
		}, done);
	})

	it ('emits an event if changes are saved successfully', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.click('#saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('does not call the api when the cancel changes button is clicked', () => {
		bootstrapWrapper();

		// Assuming I add a logo from the library
		ui.click('div.all div[data-id="2"]');

		ui.type('input[name="hex"]', '#0099ff');
		ui.click('#save');

		// And I remove a logo from the page
		ui.click('div.page div[data-id="1"][data-background="#000000"] span.del');

		// When I click the save changes button
		ui.click('#cancelChanges');

		ajaxHelper.expectNoRequests();
	})

	it ('emits an event if changes are cancelled', () => {
		bootstrapWrapper();

		ui.click('#cancelChanges');

		ui.expectEvent('cancel');
	})

	xit ('logos in the library can be edited through a form', () => {
		
	})

	xit ('an api call is performed if the save logo button is pressed', () => {
		
	})

	xit ('no api call is performed if the cancel logo button is pressed', () => {
		
	})

	let bootstrapWrapper = (pageLogos, allLogos) => {
		pageLogos = pageLogos ? pageLogos : [
			logoHelper.make('Primary logo', logoHelper.merge({id:1}, logoHelper.pivot('#ffffff'))),
			logoHelper.make('Primary logo', logoHelper.merge({id:1}, logoHelper.pivot('#000000')))
		];

		allLogos = allLogos ? allLogos : [
			logoHelper.make('Primary logo', {id: 1}),
			logoHelper.make('Secondary logo positive', {id: 2}),
			logoHelper.make('Secondary logo negative', {id: 3})
		];

		wrapper = mount(LogoEditor, {
			propsData: { 
				dataPageLogos: pageLogos, 
				dataAllLogos: allLogos, 
				dataEndpoint: '/logos'
			}
		});

	    ui = new TestHelper(wrapper);
	}

	let mockSuccessfullRequest = (record, override) => {
		ajaxHelper.stubRequest(/logos/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/logos/, ajaxHelper.getResponseWithValidationErrors({
			title: ['Title is required'],
			file: ['Please provide a file'],
		}));
	}
})