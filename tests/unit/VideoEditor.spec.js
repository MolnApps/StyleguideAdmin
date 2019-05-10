import { mount, shallowMount } from '@vue/test-utils'
import VideoEditor from '@/components/VideoEditor.vue'
import VideoForm from '@/components/VideoForm.vue'
import Vimeo from '@/components/Vimeo.vue'
import Draggable from 'vuedraggable'
import {TestHelper, AjaxHelper} from './../helpers/Helpers.js'

describe('VideoEditor.vue', () => {
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

	it ('displays a list of video associated with the page', () => {
		ui.seeElement('div[data-id="1"]');
		ui.seeElement('div[data-id="2"]');
	})

	it ('displays a button to remove a video from the page', () => {
		ui.seeElement('div[data-id="1"] span.del');
		ui.seeElement('div[data-id="2"] span.del');
	})

	it ('removes a video from the page when the remove button is clicked', () => {
		ui.seeElement('div[data-id="1"]');
		ui.seeElement('div[data-id="2"]');

		ui.click('div[data-id="2"] span.del');

		ui.seeElement('div[data-id="1"]');
		ui.notSeeElement('div[data-id="2"]');
	})

	it ('displays a button to add a video', () => {
		ui.seeInput('button[id="add"]');
	})

	it ('displays a button to edit a video', () => {
		ui.seeElement('div[data-id="1"] span.edit');
		ui.seeElement('div[data-id="2"] span.edit');
	})

	it ('displays the form when the edit video is clicked', () => {
		ui.notSeeForm('#videoForm');

		ui.click('div[data-id="1"] span.edit');

		ui.seeForm('#videoForm');
	})

	it ('displays a form to add a new video', () => {
		ui.notSeeForm('#videoForm');

		ui.click('#add');

		ui.seeForm('#videoForm');
	})

	it ('hides the editor when the form is visible', () => {
		ui.seeElement('#editor');
		
		ui.click('#add');

		ui.notSeeElement('#editor');
	})

	it ('hides the form when the user cancels', () => {
		ui.click('#add');

		ui.seeForm('#videoForm');

		wrapper.find(VideoForm).vm.$emit('cancel');

		ui.notSeeForm('#videoForm');
	})

	it ('when the form submission is successful it will add the video to the page', () => {
		ui.notSeeElement('div[data-id="3"]');	
		
		ui.click('#add');
		wrapper.find(VideoForm).vm.$emit('success', {id: 3, provider: 'vimeo', provider_id: '123456'});

		ui.seeElement('div[data-id="3"]');	
	})

	it ('displays a button to save the changes', () => {
		ui.seeElement('#saveChanges');
	})

	it ('displays a button to cancel the changes', () => {
		ui.seeElement('#cancelChanges');
	})

	it ('performs an api call when the save changes button is clicked', (done) => {
		mockSuccessfullRequest();

		ajaxHelper.expectNoRequests();

		ui.click('#saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/pages/1/video', {
				video_id: [1, 2]
			})
		}, done);
	})

	it ('does not perform any api call when the cancel changes button is clicked', () => {
		ui.click('#cancelChanges');

		ajaxHelper.expectNoRequests();
	})

	it ('emits an event when the save changes button is clicked and api call performed', (done) => {
		mockSuccessfullRequest();

		ui.notExpectEvent('success');

		ui.click('#saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('emits an event when the cancel button is clicked', () => {
		ui.notExpectEvent('cancel');

		ui.click('#cancelChanges');

		ui.expectEvent('cancel');
	})

	it ('allows to sort videos', () => {
		expect(wrapper.find(Draggable).exists()).toBe(true);
	})

	let bootstrapComponent = () => {
		wrapper = mount(VideoEditor, {
			propsData: { 
				dataPageVideo: [
					{id: 1, provider: 'vimeo', provider_id: 'abc123'},
					{id: 2, provider: 'youtube', provider_id: 'def456'}
				], 
				dataEndpoint: '/pages/1/video',
				dataCreateEndpoint: '/videos'
			}
		});

		ui = new TestHelper(wrapper);
	}

	let mockSuccessfullRequest = (record, override) => {
		ajaxHelper.stubRequest(/video/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/video/, ajaxHelper.getResponseWithValidationErrors({}));
	}
})