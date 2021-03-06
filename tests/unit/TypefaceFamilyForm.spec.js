import { mount, shallowMount } from '@vue/test-utils'
import TypefaceFamilyForm from '@/components/TypefaceFamilyForm.vue'
import {TestHelper, AjaxHelper, TypographyHelper, StateHelper} from './../helpers/Helpers.js'
import moxios from 'moxios';

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('TypefaceFamilyForm.vue', () => {
	let wrapper;
	let ui;
	let typographyHelper;
	let ajaxHelper;
    let store;

	beforeEach(() => {
        store = stateHelper.freshStore();

		typographyHelper = new TypographyHelper();

		ajaxHelper = new AjaxHelper();

	    ajaxHelper.install();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
    })

    it ('can be instantiated', () => {
    	bootstrapWrapper();
    })

    it ('displays a filled form', () => {
    	bootstrapWrapper();

    	ui.seeForm('#typefaceFamilyForm');
    	ui.seeInput('input[name="title"]', 'Rubik');
    	ui.seeInput('input[name="webfont_url"]', 'https://fonts.googleapis.com/css?family=Rubik:700,400,300');
    	ui.seeInput('input[name="foundry_url"]', 'https://fonts.google.com/specimen/Rubik');

    	ui.seeInput('input[name="weights[0][name]"]', 'Rubik bold');
    	ui.seeInput('input[name="weights[1][name]"]', 'Rubik regular');
    	ui.seeInput('input[name="weights[2][name]"]', 'Rubik light');
    	ui.seeInput('input[name="weights[0][weight]"]', '700');
    	ui.seeInput('input[name="weights[1][weight]"]', '400');
    	ui.seeInput('input[name="weights[2][weight]"]', '300');
    	
    	ui.seeButton('$save');
    	ui.seeButton('$cancel');
    })

    it ('performs an api call when the save button is clicked', (done) => {
    	bootstrapWrapper();

    	mockSuccessfullRequest();

    	ui.click('$save');

    	ajaxHelper.expectAfterRequest(() => {
    		ajaxHelper.expectRequest('/typography/2', {
    			title: 'Rubik',
    			webfont_url: 'https://fonts.googleapis.com/css?family=Rubik:700,400,300',
    			foundry_url: 'https://fonts.google.com/specimen/Rubik',
    			weights: [
    				{name: 'Rubik bold', weight: '700'},
    				{name: 'Rubik regular', weight: '400'},
    				{name: 'Rubik light', weight: '300'},
    			]
    		});
    	}, done);
    })

    it ('emits an event when the save button is clicked', (done) => {
    	bootstrapWrapper();

    	let typefaceFamily = typographyHelper.make(2, 'Rubik', [700, 400]);

    	mockSuccessfullRequest(typefaceFamily);

    	ui.click('$save');

    	ajaxHelper.expectAfterRequest(() => {
    		ui.expectEvent('success');
    		ui.expectEventData('success', [typefaceFamily])
    	}, done);
    })

    it ('displays feedback after successful api call', (done) => {
        bootstrapWrapper();

        mockSuccessfullRequest();

        ui.notSeeBusFeedback();

        ui.click('$save');

        ajaxHelper.expectAfterRequest(() => {
            ui.seeBusFeedback();
        }, done);
    })

    it ('does not perform any api call when the cancel button is clicked', () => {
    	bootstrapWrapper();

    	ui.click('$cancel');

    	ajaxHelper.expectNoRequests();
    })

    it ('emits an event when the cancel button is clicked', () => {
    	bootstrapWrapper();

    	ui.click('$cancel');

    	ui.expectEvent('cancel');
    })

    it ('displays validation errors', (done) => {
    	bootstrapWrapper();

    	mockRequestWithValidationErrors();

    	ui.click('$save');

    	ajaxHelper.expectAfterRequest(() => {
    		ui.see('Title is required');
    		ui.see('Please provide a webfont url');
    		ui.see('Please provide a foundry url');
    	}, done);
    })

    it ('resets the form when the api call is done', (done) => {
    	bootstrapWrapper();

    	mockSuccessfullRequest({title: 'Lato'});

    	ui.type('input[name="title"]', 'Roboto');

    	ui.click('$save');

    	ajaxHelper.expectAfterRequest(() => {
    		ui.seeInput('input[name="title"]', 'Lato');
    	}, done);
    })

    it ('resets the form when the cancel button is clicked', () => {
    	bootstrapWrapper();

    	ui.type('input[name="title"]', 'Roboto');

    	ui.click('$cancel');

    	ui.seeInput('input[name="title"]', 'Rubik');
    })

    it ('removes weight inputs', () => {
    	bootstrapWrapper();

    	ui.seeInput('input[name="weights[0][name]"]', 'Rubik bold');
    	ui.seeInput('input[name="weights[1][name]"]', 'Rubik regular');
    	ui.seeInput('input[name="weights[2][name]"]', 'Rubik light');
    	ui.seeInput('input[name="weights[0][weight]"]', '700');
    	ui.seeInput('input[name="weights[1][weight]"]', '400');
    	ui.seeInput('input[name="weights[2][weight]"]', '300');

    	ui.click('.del');

    	ui.seeInput('input[name="weights[0][name]"]', 'Rubik regular');
    	ui.seeInput('input[name="weights[1][name]"]', 'Rubik light');
    	ui.seeInput('input[name="weights[0][weight]"]', '400');
    	ui.seeInput('input[name="weights[1][weight]"]', '300');
    })

    it ('adds weight inputs', () => {
    	bootstrapWrapper();

    	ui.notSeeInput('input[name="weights[3][name]"]', '');
    	ui.notSeeInput('input[name="weights[3][weight]"]', '');

    	ui.click('$add');

		ui.seeInput('input[name="weights[3][name]"]', '');
    	ui.seeInput('input[name="weights[3][weight]"]', '');
    })

	let bootstrapWrapper = (typefaceFamily) => {
		typefaceFamily = typefaceFamily 
			? typefaceFamily 
			: typographyHelper.make(2, 'Rubik', [700, 400, 300]);

        wrapper = mount(TypefaceFamilyForm, {
            localVue,
            store,
			propsData: { 
				dataTypefaceFamily: typefaceFamily, 
				dataEndpoint: '/typography'
			}
		});

	    ui = new TestHelper(wrapper);

	    typographyHelper.setWrapper(wrapper).setTestHelper(ui);

        stateHelper.propagateFeedback(wrapper);
	}

	let mockSuccessfullRequest = (record, override) => {
        record = record
            ? record
            : typographyHelper.make(2, 'Rubik', [700, 400, 300]);
		ajaxHelper.stubRequest(/typography/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/typography/, ajaxHelper.getResponseWithValidationErrors({
			title: ['Title is required'],
			webfont_url: ['Please provide a webfont url'],
			foundry_url: ['Please provide a foundry url'],
		}));
	}
})