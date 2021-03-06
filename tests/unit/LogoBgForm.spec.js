import { mount, shallowMount } from '@vue/test-utils'
import LogoBgForm from '@/components/LogoBgForm.vue'
import Logo from '@/components/Logo.vue'
import { Sketch } from 'vue-color'
import {TestHelper, AjaxHelper, LogoHelper, StateHelper} from './../helpers/Helpers.js'

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('LogoBgForm.vue', () => {
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

    it ('presents a filled form', () => {
    	bootstrapWrapper(logoHelper.pivot('#0099ff'));

    	ui.seeForm('#logoBgForm');
    	ui.seeInput('input[name="hex"]', '#0099ff');
    	ui.seeButton('$save');
    })

    it ('emits an event if the save button is clicked', () => {
    	bootstrapWrapper(logoHelper.pivot('#0099ff'));

    	ui.click('$save');

    	ui.expectEvent('success');
    })

    it ('does not perform any api call when the save button is clicked', () => {
    	bootstrapWrapper(logoHelper.pivot('#0099ff'));

    	ui.click('$save');

    	ajaxHelper.expectNoRequests();
    })

    it ('resets the original background colour when the cancel button is clicked', () => {
    	bootstrapWrapper(logoHelper.pivot('#0099ff'));

    	ui.type('input[name="hex"]', '#ff0000');

    	ui.click('$cancel');

    	ui.seeInput('input[name="hex"]', '#0099ff');
    })

    it ('emits an event when the cancel button is clicked', () => {
    	bootstrapWrapper(logoHelper.pivot('#0099ff'));

    	ui.click('$cancel');

    	ui.expectEvent('cancel');
    })

    it ('displays a logo with the background', () => {
    	expect(wrapper.find(Logo).exists()).toBe(true);
    })

    it ('displays a colour picker', () => {
    	expect(wrapper.find(Sketch).exists()).toBe(true);
    })

	let bootstrapWrapper = (pivot) => {
		wrapper = shallowMount(LogoBgForm, {
            localVue,
            store,
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