import { mount, shallowMount } from '@vue/test-utils'
import VideoForm from '@/components/VideoForm.vue'
import Vimeo from '@/components/Vimeo.vue'
import Youtube from '@/components/Youtube.vue'
import Draggable from 'vuedraggable'
import {TestHelper, AjaxHelper} from './../helpers/Helpers.js'

describe('VideoForm.vue', () => {
	let wrapper;
	let ui;
	let videoHelper;
	let ajaxHelper;

	beforeEach(() => {
		ajaxHelper = new AjaxHelper();

	    ajaxHelper.install();

	    bootstrapComponent();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
    })

    it ('displays an empty form', () => {
    	bootstrapComponent({});

    	ui.seeForm('#videoForm');
    	ui.seeInput('input[name="url"]', '');
    	ui.seeInput('input[name="provider"]', '');
    	ui.seeInput('input[name="provider_id"]', '');
    })

	it ('displays a filled form', () => {
		ui.seeForm('#videoForm');
		expect(wrapper.find(Vimeo).exists()).toBe(true);
		ui.seeInput('input[name="url"]', '');
		ui.seeInput('input[name="provider"]', 'vimeo');
    	ui.seeInput('input[name="provider_id"]', 'abc123');
	})

	it ('performs an api call when user paste a url', (done) => {
		mockSuccessfullUrlRequest({provider: 'youtube', provider_id: '1eMg23jjR_c'});

		ui.type('input[name="url"]', 'https://www.youtube.com/watch?v=1eMg23jjR_c');
		
		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/videos/url', {url: 'https://www.youtube.com/watch?v=1eMg23jjR_c'});
		}, done);
	})

	it ('embeds a video immediately after the api call response', (done) => {
		mockSuccessfullUrlRequest({provider: 'youtube', provider_id: '1eMg23jjR_c'});

		ui.type('input[name="url"]', 'https://www.youtube.com/watch?v=1eMg23jjR_c');
		
		ajaxHelper.expectAfterRequest(() => {
			expect(wrapper.find(Youtube).exists()).toBe(true);
		}, done);
	})

	it ('emits an event when the user types a url', (done) => {
		mockSuccessfullUrlRequest({provider: 'youtube', provider_id: '1eMg23jjR_c'});

		ui.notExpectEvent('embedded');

		ui.type('input[name="url"]', 'https://www.youtube.com/watch?v=1eMg23jjR_c');
		
		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('embedded');
		}, done);
	})

	it ('performs an api call when the save button is clicked', (done) => {
		mockSuccessfullRequest({id: 1, provider: 'youtube', provider_id: '1eMg23jjR_c'});

		ui.click('#save');
		
		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/videos/1', {
				provider: 'vimeo',
				provider_id: 'abc123'
			});
		}, done);
	})

	it ('emits an event when the cancel button is clicked', () => {
		ui.notExpectEvent('cancel');

		ui.click('#cancel');

		ui.expectEvent('cancel');
	})

	it ('emits an event when the save button is clicked', (done) => {
		mockSuccessfullRequest({id: 1, provider: 'youtube', provider_id: '1eMg23jjR_c'});

		ui.notExpectEvent('success');

		ui.click('#save');
		
		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('displays error message if the url is not supported', (done) => {
		mockUrlRequestWithError('The url is not supported');

		ui.type('input[name="url"]', 'foobar');

		ajaxHelper.expectAfterRequest(() => {
			ui.see('The url is not supported');
			ui.notExpectEvent('success');
		}, done);
	})

	it ('resets the form when the cancel button is clicked', () => {
		ui.seeInput('input[name="provider"]', 'vimeo');

		ui.type('input[name="provider"]', 'youtube');
		
		ui.click('#cancel');

		ui.seeInput('input[name="provider"]', 'vimeo');
	})

	it ('resets the form when the save button is clicked', (done) => {
		mockSuccessfullRequest({id: 1, provider: 'youtube', provider_id: '1eMg23jjR_c'});

		ui.seeInput('input[name="provider"]', 'vimeo');
		ui.seeInput('input[name="provider_id"]', 'abc123');

		ui.click('#save');
		
		ajaxHelper.expectAfterRequest(() => {
			ui.seeInput('input[name="provider"]', 'youtube');
			ui.seeInput('input[name="provider_id"]', '1eMg23jjR_c');
		}, done);
	})

	let bootstrapComponent = (video) => {
		video = video ? video : {id: 1, provider: 'vimeo', provider_id: 'abc123'};
		wrapper = mount(VideoForm, {
			propsData: { 
				dataVideo: video, 
				dataEndpoint: '/videos'
			}
		});

		ui = new TestHelper(wrapper);
	}

	let mockSuccessfullRequest = (record, override) => {
		ajaxHelper.stubRequest(/video/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockSuccessfullUrlRequest = (record, override) => {
		ajaxHelper.stubRequest(/url/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/video/, ajaxHelper.getResponseWithValidationErrors({}));
	}

	let mockUrlRequestWithError = (error) => {
		ajaxHelper.stubRequest(/url/, ajaxHelper.getResponseWithErrors(error));
	}
})