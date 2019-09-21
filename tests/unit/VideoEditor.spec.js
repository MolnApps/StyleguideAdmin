import { mount, shallowMount } from '@vue/test-utils'
import VideoEditor from '@/components/VideoEditor.vue'
import VideoForm from '@/components/VideoForm.vue'
import Vimeo from '@/components/Vimeo.vue'
import Draggable from 'vuedraggable'
import {TestHelper, AjaxHelper, StateHelper} from './../helpers/Helpers.js'

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('VideoEditor.vue', () => {
	let wrapper;
	let ui;
	let videoHelper;
	let ajaxHelper;
	let store;

	beforeEach(() => {
		store = stateHelper.freshStore();

		ajaxHelper = new AjaxHelper();

	    ajaxHelper.install();

	    bootstrapComponent();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
    })

	it ('displays a list of video associated with the page', () => {
		ui.seeElement('div[data-id="1"]');
		ui.seeElement('div[data-id="2"]');
	})

	it ('displays a button to remove a video from the page', () => {
		ui.seeElement('div[data-id="1"] .del');
		ui.seeElement('div[data-id="2"] .del');
	})

	it ('removes a video from the page when the remove button is clicked', () => {
		ui.seeElement('div[data-id="1"]');
		ui.seeElement('div[data-id="2"]');

		ui.click('div[data-id="2"] .del');

		ui.seeElement('div[data-id="1"]');
		ui.notSeeElement('div[data-id="2"]');
	})

	it ('displays a button to add a video', () => {
		ui.seeButton('$add');
	})

	it ('displays a button to edit a video', () => {
		ui.seeElement('div[data-id="1"] .edit');
		ui.seeElement('div[data-id="2"] .edit');
	})

	it ('displays the form when the edit video is clicked', () => {
		ui.notSeeForm('#videoForm');

		ui.click('div[data-id="1"] .edit');

		ui.seeForm('#videoForm');
	})

	it ('displays a form to add a new video', () => {
		ui.notSeeForm('#videoForm');

		ui.click('$add');

		ui.seeForm('#videoForm');
	})

	it ('hides the editor when the form is visible', () => {
		ui.seeElement('#editor');
		
		ui.click('$add');

		ui.notSeeElement('#editor');
	})

	it ('hides the form when the user cancels', () => {
		ui.click('$add');

		ui.seeForm('#videoForm');

		wrapper.find(VideoForm).vm.$emit('cancel');

		ui.notSeeForm('#videoForm');
	})

	it ('when the form submission is successful it will add the video to the page', () => {
		ui.notSeeElement('div[data-id="3"]');	
		
		ui.click('$add');
		wrapper.find(VideoForm).vm.$emit('success', {id: 3, provider: 'vimeo', provider_id: '123456'});

		ui.seeElement('div[data-id="3"]');	
	})

	it ('displays a button to save the changes', () => {
		ui.seeButton('$saveChanges');
	})

	it ('displays a button to cancel the changes', () => {
		ui.seeButton('$cancelChanges');
	})

	it ('performs an api call when the save changes button is clicked', (done) => {
		mockSuccessfullRequest();

		ajaxHelper.expectNoRequests();

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/pages/1/video', {
				video_id: [1, 2]
			})
		}, done);
	})

	it ('does not perform any api call when the cancel changes button is clicked', () => {
		ui.click('$cancelChanges');

		ajaxHelper.expectNoRequests();
	})

	it ('emits an event when the save changes button is clicked and api call performed', (done) => {
		mockSuccessfullRequest();

		ui.notExpectEvent('success');

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('emits an event when the cancel button is clicked', () => {
		ui.notExpectEvent('cancel');

		ui.click('$cancelChanges');

		ui.expectEvent('cancel');
	})

	it ('displays a feedback after a successful api call', (done) => {
		mockSuccessfullRequest();

		ajaxHelper.expectNoRequests();

		ui.notSeeBusFeedback();

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeBusFeedback();
		}, done);
	})

	it ('allows to sort videos', () => {
		expect(wrapper.find(Draggable).exists()).toBe(true);
	})

	let bootstrapComponent = () => {
		bootstrapStore();

		wrapper = mount(VideoEditor, {
			localVue,
			store,
			propsData: { 
				dataPage: {id: 1, slug: 'my-video-page', component: 'video'}, 
				dataPageEndpoint: '/pages/1/video',
				dataEndpoint: '/videos'
			}
		});

		ui = new TestHelper(wrapper);

		stateHelper.propagateFeedback(wrapper);
	}

	let bootstrapStore = () => {
		store.dispatch('video/initialize', {
			'_library': [],
			'my-video-page': [
				{id: 1, provider: 'vimeo', provider_id: 'abc123'},
				{id: 2, provider: 'youtube', provider_id: 'def456'}
			],
		})
	}

	let mockSuccessfullRequest = (record, override) => {
		ajaxHelper.stubRequest(/video/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/video/, ajaxHelper.getResponseWithValidationErrors({}));
	}
})