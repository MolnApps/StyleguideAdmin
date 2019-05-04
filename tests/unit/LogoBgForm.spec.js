import { mount, shallowMount } from '@vue/test-utils'
import LogoBgForm from '@/components/LogoBgForm.vue'
import {TestHelper, AjaxHelper, LogoHelper} from './../helpers/Helpers.js'
import moxios from 'moxios';

describe('LogoBgForm.vue', () => {
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

    it ('presents a filled form', () => {
    	bootstrapWrapper(logoHelper.pivot('#0099ff'));

    	ui.seeForm('#logoBgForm');
    	ui.seeInput('input[name="hex"]', '#0099ff');
    	ui.seeInput('button[id="save"]');
    })

    it ('emits an event if the save button is clicked', () => {
    	bootstrapWrapper(logoHelper.pivot('#0099ff'));

    	ui.click('button[id="save"]');

    	ui.expectEvent('success');
    })

    it ('does not perform any api call when the save button is clicked', () => {
    	bootstrapWrapper(logoHelper.pivot('#0099ff'));

    	ui.click('button[id="save"]');

    	ajaxHelper.expectNoRequests();
    })

	let bootstrapWrapper = (pivot) => {
		wrapper = shallowMount(LogoBgForm, {
			propsData: { 
				dataLogo: logoHelper.make(
					'Primary logo', 
					logoHelper.merge(pivot, {id: 2})
				)
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
			hex: ['Please provide a valid hex value'],
		}));
	}
})