import { mount, shallowMount } from '@vue/test-utils'
import MoodboardEditor from '@/components/MoodboardEditor.vue'
import MoodboardDropzone from '@/components/MoodboardDropzone.vue'
import Draggable from 'vuedraggable'
import {TestHelper, AjaxHelper, MoodboardHelper, StateHelper} from './../helpers/Helpers.js'

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('MoodboardEditor.vue', () => {
	let wrapper;
	let ui;
	let moodboardHelper;
	let ajaxHelper;
	let store;

	beforeEach(() => {
		store = stateHelper.freshStore();

		moodboardHelper = new MoodboardHelper();

		ajaxHelper = new AjaxHelper();

	    ajaxHelper.install();

	    bootstrapComponent();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
    })

	it ('displays a list of images associated with the page', () => {
		expect(wrapper.findAll('div.page div.image').length).toBe(3);
	})

	it ('displays a remove button', () => {
		expect(wrapper.findAll('div.page div.image .del').length).toBe(3);
	})

	it ('removes the image when the remove button is clicked', () => {
		expect(wrapper.findAll('div.page div.image').length).toBe(3);
		expect(wrapper.find('div.page div.image[data-id="1"]').exists()).toBe(true);
		expect(wrapper.find('div.page div.image[data-id="2"]').exists()).toBe(true);
		expect(wrapper.find('div.page div.image[data-id="3"]').exists()).toBe(true);

		expect(wrapper.findAll('div.page div.image .del').at(1).trigger('click'))

		expect(wrapper.findAll('div.page div.image').length).toBe(2);
		expect(wrapper.find('div.page div.image[data-id="1"]').exists()).toBe(true);
		expect(wrapper.find('div.page div.image[data-id="2"]').exists()).toBe(false);
		expect(wrapper.find('div.page div.image[data-id="3"]').exists()).toBe(true);
	})

	it ('allows to sort images', () => {
		expect(wrapper.find(Draggable).exists()).toBe(true);
	})

	it ('displays a save changes button', () => {
		ui.seeButton('$saveChanges');
	})

	it ('displays a cancel changes button', () => {
		ui.seeButton('$cancelChanges');
	})

	it ('performs an api call when the save changes button is clicked', (done) => {
		mockSuccessfullRequest();

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/pages/1/images', {
				image_id: [1, 2, 3]
			})
		}, done);
	})

	it ('fires an event when the changes are saved', (done) => {
		mockSuccessfullRequest();

		ui.notExpectEvent('success');

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('displays feedback when the changes are saved', (done) => {
		mockSuccessfullRequest();

		ui.notSeeFeedback();

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeFeedback();
		}, done);
	})

	it ('does not perform any api call when the cancell button is clicked', () => {
		ui.click('$cancelChanges');

		ajaxHelper.expectNoRequests();
	})

	it ('fires an event when the cancel button is clicked', () => {
		ui.click('$cancelChanges');
		
		ui.expectEvent('cancel');
	})

	it ('displays a draggable zone to upload additional images', () => {
		ui.seeElement(MoodboardDropzone);
	})

	it ('will add an image to the page when the upload is done', () => {
		ui.notSeeElement('div[data-id="4"]');

		wrapper.find(MoodboardDropzone).vm.$emit('success', {
			id: 4, 
			url: 'https://lorempixel.com/488/479/?14860',
			width: 488,
			height: 479
		});

		ui.seeElement('div[data-id="4"]');
	})

	let bootstrapComponent = () => {
		wrapper = mount(MoodboardEditor, {
			localVue,
			store,
			propsData: { 
				dataPageImages: moodboardHelper.getImages(), 
				dataPageEndpoint: '/pages/1/images',
				dataEndpoint: '/images'
			}
		});

		ui = new TestHelper(wrapper);

		moodboardHelper.setWrapper(wrapper).setTestHelper(ui);
	}

	let mockSuccessfullRequest = (record, override) => {
		ajaxHelper.stubRequest(/images/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/images/, ajaxHelper.getResponseWithValidationErrors({
			
		}));
	}
})