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

	it ('can arrange logos in a different order', () => {
		
	})

	it ('provides the possibility to specify multiple backgrounds for the same logo', () => {
		
	})

	it ('it presents a button to add a new logo', () => {
		
	})

	it ('presents a form when the add button is clicked', () => {
		
	})

	it ('hides all other elements when the form is shown', () => {
		
	})

	it ('if the form save button is clicked the logo is added to the page', () => {
		
	})

	it ('it displays validation errors for the form', () => {
		
	})

	it ('resets the form when the save button is clicked', () => {
		
	})

	it ('will not affect previously added logos when multiple logos are added', () => {
		
	})

	it ('it edits a logo', () => {
		
	})

	it ('removes a logo', () => {
		
	})

	it ('calls the api when the save changes button is clicked', () => {
		
	})

	it ('emits an event if changes are saved successfully', () => {
		
	})

	it ('does not call the api when the cancel changes button is clicked', () => {
		
	})

	it ('emits an event if changes are cancelled', () => {
		
	})

	let bootstrapWrapper = (pageLogos, allLogos) => {
		pageLogos = pageLogos ? pageLogos : [
			logoHelper.make('Primary logo', logoHelper.pivot('#ffffff')),
			logoHelper.make('Primary logo', logoHelper.pivot('#000000'))
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
		ajaxHelper.stubRequest(/colours/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/colours/, ajaxHelper.getResponseWithValidationErrors({
			title: ['Title is required'],
			hex: ['Hex value is required'],
			rgb: ['RGB value is required'],
			cmyk: ['CMYK value is required'],
			pantone: ['Pantone is required'],
		}));
	}
})