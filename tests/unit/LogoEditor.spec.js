// Prevent an error to display in the console.
HTMLCanvasElement.prototype.getContext = jest.fn()

import { mount, shallowMount } from '@vue/test-utils'
import LogoEditor from '@/components/LogoEditor.vue'
import {TestHelper, AjaxHelper, LogoHelper, StateHelper} from './../helpers/Helpers.js'
import moxios from 'moxios';
import Draggable from 'vuedraggable';
import ConfirmModal from '@/modals/ConfirmModal';

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('LogoEditor.vue', () => {
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

	it ('shows all page logos and their background', () => {
		bootstrapWrapper()

		logoHelper.seePageLogo(1, '#ffffff');
		logoHelper.seePageLogo(1, '#000000');
	})

	it ('shows all logos including the ones already associate with the page', () => {
		bootstrapWrapper()

		ui.seeElement('div.all div[data-id="1"]');
		ui.seeElement('div.all div[data-id="2"]');
		ui.seeElement('div.all div[data-id="3"]');
	})

	it ('can arrange logos in a different order', () => {
		expect(wrapper.find(Draggable).exists()).toBe(true);
	})

	it ('presents a button to add a new logo', () => {
		bootstrapWrapper()

		ui.seeButton('$add');
	})

	it ('removes a logo', () => {
		bootstrapWrapper();

		logoHelper.seePageLogo(1, '#ffffff');
		logoHelper.seePageLogo(1, '#000000');

		logoHelper.removeLogoFromPage();

		logoHelper.seePageLogo(1, '#ffffff');
		logoHelper.notSeePageLogo(1, '#000000');
	})

	it ('adds a logo from the library on click', () => {
		bootstrapWrapper();

		logoHelper.addLogoFromLibrary();
		
		logoHelper.seePageLogo(2, '#0099ff');
	})

	it ('allows to cancel adding a logo', () => {
		bootstrapWrapper();

		ui.click('div.all div[data-id="2"] .add');

		ui.seeForm('#logoBgForm');
		ui.type('input[name="hex"]', '#0099ff');
		ui.click('#cancel');
		
		logoHelper.notSeePageLogo(2, '');
		logoHelper.notSeePageLogo(2, '#0099ff');
	})

	// Changes form methods

	it ('calls the api when the save changes button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		logoHelper.addLogoFromLibrary();
		logoHelper.removeLogoFromPage();

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/pages/1/logos', {
				logo: [
					{id: 1, 'background-color': '#ffffff'}, 
					{id: 2, 'background-color': '#0099ff'}
				] 
			});
		}, done);
	})

	it ('emits an event if changes are saved successfully', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('displays feedback if changes are saved successfully', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeBusFeedback();
		}, done);
	})

	it ('does not call the api when the cancel changes button is clicked', () => {
		bootstrapWrapper();

		logoHelper.addLogoFromLibrary();
		logoHelper.removeLogoFromPage();

		ui.click('$cancelChanges');

		ajaxHelper.expectNoRequests();
	})

	it ('emits an event if changes are cancelled', () => {
		bootstrapWrapper();

		ui.click('$cancelChanges');

		ui.expectEvent('cancel');
	})

	// Logo form tests

	it ('shows logo form when the add button is clicked', () => {
		bootstrapWrapper()

		ui.click('$add');

		ui.seeForm('#logoForm');
	})

	it ('hides all other elements when the form is shown', () => {
		bootstrapWrapper()

		ui.click('$add');

		ui.notSeeElement('div.page');
		ui.notSeeElement('div.all');
		ui.notSeeElement('#add');
	})

	it ('adds the logo to the page if the form save button is clicked', (done) => {
		bootstrapWrapper();

		let logo = logoHelper.make('My logo');

		mockSuccessfullRequest(logo, {id: 25});

		ui.click('$add');
		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			logoHelper.seePageLogo(25, '');
		}, done);
	})

	it ('does not hide logo form with validation errors', (done) => {
		bootstrapWrapper();

		mockRequestWithValidationErrors();

		ui.click('$add');
		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeForm('#logoForm');
		}, done);
	})

	it ('hides the logo form when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.click('$add');

		ui.seeForm('#logoForm');

		ui.click('#cancel');

		ui.notSeeForm('#logoForm');
	})

	// Logo Background tests

	it ('edits a logo background', () => {
		bootstrapWrapper();

		logoHelper.seePageLogo(1, '#ffffff');
		logoHelper.seePageLogo(1, '#000000');
		
		logoHelper.clickEditLogoBg();

		ui.seeForm('#logoBgForm');
		ui.type('input[name="hex"]', '#ff0000');
		ui.click('#save');

		ui.notSeeForm('#logoBgForm');

		logoHelper.seePageLogo(1, '#ffffff');
		logoHelper.seePageLogo(1, '#ff0000');
	})

	it ('allows the user to cancel editing a logo background', () => {
		bootstrapWrapper();

		logoHelper.seePageLogo(1, '#ffffff');
		logoHelper.seePageLogo(1, '#000000');
		
		logoHelper.clickEditLogoBg();

		ui.seeForm('#logoBgForm');
		ui.type('input[name="hex"]', '#ff0000');
		ui.click('#cancel');

		ui.notSeeForm('#logoBgForm');

		logoHelper.seePageLogo(1, '#ffffff');
		logoHelper.seePageLogo(1, '#000000');
	})

	// Logo Spec Form tests

	it ('shows the logo spec form when library logo edit button is clicked', () => {
		bootstrapWrapper();

		logoHelper.clickEditLogo();
		
		ui.seeForm('#logoSpecForm');
	})

	it ('hides the logo spec form when the save button is pressed', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest(logoHelper.make('Foobar', {id: 2}), {});

		logoHelper.clickEditLogo();

		ui.click('button[id="save"]');

		ajaxHelper.expectAfterRequest(() => {
			ui.notSeeForm('#logoSpecForm');
		}, done);
	})

	it ('does not hide the logo spec form with validation errors', (done) => {
		bootstrapWrapper();

		mockRequestWithValidationErrors();

		logoHelper.clickEditLogo();

		ui.click('button[id="save"]');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeForm('#logoSpecForm');
		}, done);
	})

	it ('hides the logo spec form when the cancel button is pressed', () => {
		bootstrapWrapper();

		logoHelper.clickEditLogo();

		ui.click('button[id="cancel"]');

		ajaxHelper.expectNoRequests();
		ui.notSeeForm('#logoSpecForm');
	})

	it ('displays a button to remove a logo from the library', () => {
		bootstrapWrapper();

		ui.seeElement('.del', '.all');
	})

	it ('displays a confirmation modal before removing a logo from the library', () => {
		bootstrapWrapper();

		ui.seeChildComponent(ConfirmModal);
	})

	it ('will not remove a logo from library if the user cancels', () => {
		bootstrapWrapper();

		ui.see('Secondary logo positive', '.all');

		ui.click('.all div[data-id="2"] .del');
		ui.emit(ConfirmModal, 'cancel');

		ajaxHelper.expectNoRequests();
		ui.see('Secondary logo positive', '.all');
	})

	it ('will remove a logo from library if the user confirms', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.see('Secondary logo positive', '.all');

		ui.click('.all div[data-id="2"] .del');
		ui.emit(ConfirmModal, 'confirm');

		ajaxHelper.expectAfterRequest(() => {
			ui.notSee('Secondary logo positive', '.all');
			ajaxHelper.expectRequest('/logos/2', {'_method': 'delete'});
			ui.seeBusFeedback();
		}, done);
	})

	// Utility methods

	let bootstrapWrapper = () => {
		bootstrapStore();

		wrapper = mount(LogoEditor, {
			localVue,
			store,
			propsData: { 
				dataPage: {id: 1, slug: 'my-logo-page', component: 'logo'},
				dataPageEndpoint: '/pages/1/logos',
				dataEndpoint: '/logos'
			}
		});

	    ui = new TestHelper(wrapper);

	    logoHelper.setWrapper(wrapper).setTestHelper(ui);

	    stateHelper.propagateFeedback(wrapper);
	}

	let bootstrapStore = () => {
		store.dispatch('logos/initialize', {
			'_library': [
				logoHelper.make('Primary logo', {id: 1}),
				logoHelper.make('Secondary logo positive', {id: 2}),
				logoHelper.make('Secondary logo negative', {id: 3})
			],
			'my-logo-page': [
				logoHelper.make('Primary logo', logoHelper.merge({id:1}, logoHelper.pivot('#ffffff'))),
				logoHelper.make('Primary logo', logoHelper.merge({id:1}, logoHelper.pivot('#000000')))
			]
		});
	}

	let mockSuccessfullRequest = (record, override) => {
		ajaxHelper.stubRequest(/logos/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/logos/, ajaxHelper.getResponseWithValidationErrors({}));
	}
})