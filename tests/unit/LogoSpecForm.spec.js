import { mount, shallowMount } from '@vue/test-utils'
import LogoSpecForm from '@/components/LogoSpecForm.vue'
import {TestHelper, AjaxHelper, LogoHelper} from './../helpers/Helpers.js'
import moxios from 'moxios';

describe('LogoSpecForm.vue', () => {
	let wrapper;
	let ui;
	let logoHelper;
	let ajaxHelper;

	beforeEach(() => {
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
		ui.seeInput('button[id="save"]');
		ui.seeInput('button[id="cancel"]');
	})

    it ('performs an api call when the save logo button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest(logoHelper.make('Foobar', {id: 2}), {});

		logoHelper.fillSpecForm();

		ui.click('button[id="save"]');

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

		ui.click('button[id="save"]');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

    it ('displays validation errors', (done) => {
		bootstrapWrapper();

		mockRequestWithValidationErrors();

		ui.click('button[id="save"]');

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

		ui.click('button[id="cancel"]');

		ajaxHelper.expectNoRequests();
	})

	it ('fires an event when the cancel button is pressed', () => {
		bootstrapWrapper();

		logoHelper.fillSpecForm();

		ui.click('button[id="cancel"]');

		ui.expectEvent('cancel');
	})

	let bootstrapWrapper = (pageLogos, allLogos) => {
		wrapper = shallowMount(LogoSpecForm, {
			propsData: { 
				dataLogo: logoHelper.make('Primary logo', {id: 2}), 
				dataEndpoint: '/logos/2'
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