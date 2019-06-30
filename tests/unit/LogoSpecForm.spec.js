import { mount, shallowMount } from '@vue/test-utils'
import LogoSpecForm from '@/components/LogoSpecForm.vue'
import LogoSafety from '@/components/LogoSafety.vue'
import LogoSize from '@/components/LogoSize.vue'
import {TestHelper, AjaxHelper, LogoHelper, StateHelper} from './../helpers/Helpers.js'
import moxios from 'moxios';

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('LogoSpecForm.vue', () => {
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

    it ('provides a form to edit the logos in the library', () => {
		bootstrapWrapper();

		ui.seeForm('#logoSpecForm');
		ui.seeInput('input[name="display_width"]', '200px');
		ui.seeInput('input[name="display_height"]', '200px');
		ui.seeInput('input[name="space_x"]', '30%');
		ui.seeInput('input[name="space_y"]', '30%');
		ui.seeInput('input[name="min_width"]', '30px');
		ui.seeInput('input[name="min_width_text"]', '30mm');
		
		ui.seeButton('$save');
		ui.seeButton('$cancel');
	})

    it ('performs an api call when the save logo button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest(logoHelper.make('Foobar', {id: 2}), {});

		logoHelper.fillSpecForm();

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/logos/2', {
				display_width: '300px', 
				display_height: '200px', 
				space_x: '50%',
				space_y: '25%',
				min_width: '30px',
				min_width_text: '25mm'
			});
		}, done);
	})

	it ('emits an event when the save logo button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest(logoHelper.make('Foobar', {id: 2}), {});

		logoHelper.fillSpecForm();

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('displays feedback after successful api call', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest(logoHelper.make('Foobar', {id: 2}));

		logoHelper.fillSpecForm();

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
			ui.see('Please provide a display width');
			ui.see('Please provide a display height');
			ui.see('Please provide a horizontal spacing');
			ui.see('Please provide a vertical spacing');
			ui.see('Please provide a minimum width');
			ui.see('Please provide a minimum width text');
		}, done);
	})

	it ('does not perform any api call when the cancel button is pressed', () => {
		bootstrapWrapper();

		logoHelper.fillSpecForm();

		ui.click('$cancel');

		ajaxHelper.expectNoRequests();
	})

	it ('fires an event when the cancel button is pressed', () => {
		bootstrapWrapper();

		logoHelper.fillSpecForm();

		ui.click('$cancel');

		ui.expectEvent('cancel');
	})

	it ('resets the form when the save button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest(logoHelper.make('Foobar', {
			id: 2,
			display_width: '400px'
		}));

		ui.seeInput('input[name="display_width"]', '200px');

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeInput('input[name="display_width"]', '400px');
		}, done);
	})

	it ('resets the form when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.seeInput('input[name="display_width"]', '200px');
		ui.seeInput('input[name="display_height"]', '200px');
		ui.seeInput('input[name="space_x"]', '30%');
		ui.seeInput('input[name="space_y"]', '30%');
		ui.seeInput('input[name="min_width"]', '30px');
		ui.seeInput('input[name="min_width_text"]', '30mm');

		ui.type('input[name="display_width"]', '300px');
		ui.type('input[name="display_height"]', '300px');
		ui.type('input[name="space_x"]', '50%');
		ui.type('input[name="space_y"]', '25%');
		ui.type('input[name="min_width"]', '200px');
		ui.type('input[name="min_width_text"]', '2mm');

		ui.seeInput('input[name="display_width"]', '300px');
		ui.seeInput('input[name="display_height"]', '300px');
		ui.seeInput('input[name="space_x"]', '50%');
		ui.seeInput('input[name="space_y"]', '25%');
		ui.seeInput('input[name="min_width"]', '200px');
		ui.seeInput('input[name="min_width_text"]', '2mm');

		ui.click('$cancel');

		ui.seeInput('input[name="display_width"]', '200px');
		ui.seeInput('input[name="display_height"]', '200px');
		ui.seeInput('input[name="space_x"]', '30%');
		ui.seeInput('input[name="space_y"]', '30%');
		ui.seeInput('input[name="min_width"]', '30px');
		ui.seeInput('input[name="min_width_text"]', '30mm');
	})

	it ('displays logo safety component', () => {
		bootstrapWrapper();

		expect(wrapper.find(LogoSafety).exists()).toBe(true);
	})

	it ('displays logo size component', () => {
		bootstrapWrapper();

		expect(wrapper.find(LogoSize).exists()).toBe(true);
	})

	let bootstrapWrapper = (pageLogos, allLogos) => {
		wrapper = shallowMount(LogoSpecForm, {
			localVue,
			store,
			propsData: { 
				dataLogo: logoHelper.make('Primary logo', {id: 2}), 
				dataEndpoint: '/logos'
			}
		});

	    ui = new TestHelper(wrapper);

	    logoHelper.setWrapper(wrapper).setTestHelper(ui);
	}

	let mockSuccessfullRequest = (record, override) => {
		ajaxHelper.stubRequest(/logos/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/logos/, ajaxHelper.getResponseWithValidationErrors({
			display_width: ['Please provide a display width'],
			display_height: ['Please provide a display height'],
			space_x: ['Please provide a horizontal spacing'],
			space_y: ['Please provide a vertical spacing'],
			min_width: ['Please provide a minimum width'],
			min_width_text: ['Please provide a minimum width text']
		}));
	}
})