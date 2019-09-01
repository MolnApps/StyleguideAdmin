import { mount, shallowMount } from '@vue/test-utils'
import PageSteps from '@/components/PageSteps.vue'
import PageForm from '@/components/PageForm.vue'
import ChapterForm from '@/components/ChapterForm.vue'
import LogoEditor from '@/components/LogoEditor.vue'
import ColourPaletteEditor from '@/components/ColourPaletteEditor.vue'
import TypographyEditor from '@/components/TypographyEditor.vue'
import MoodboardEditor from '@/components/MoodboardEditor.vue'
import VideoEditor from '@/components/VideoEditor.vue'
import {TestHelper, AjaxHelper, StateHelper} from './../helpers/Helpers.js'

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('PageSteps.vue', () => {
	let wrapper;
	let ui;
	let ajaxHelper;
	let store;

	beforeEach(() => {
		store = stateHelper.freshStore();

		ajaxHelper = new AjaxHelper();
	    ajaxHelper.install();

		bootstrapWrapper();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
    })
	
	it ('presents a list of page types', () => {
		ui.seeElement('#pageTypes');
		ui.seeElement('#type-chapter');
		ui.seeElement('#type-text');
		ui.seeElement('#type-text-side');
		ui.seeElement('#type-text-columns');
	})

	it ('presents a list of components available for text-side type', () => {
		ui.seeElement('#pageTypes');
		ui.notSeeElement('#pageComponents');
		ui.notSeeChildComponent(PageForm);

		ui.click('#type-text-side');
		
		ui.notSeeElement('#pageTypes');
		ui.seeElement('#pageComponents');
		ui.notSeeChildComponent(PageForm);
		
		ui.seeElement('#component-logo');
		ui.seeElement('#component-logo-safety');
		ui.seeElement('#component-logo-size');
		ui.seeElement('#component-colour-palette');
		ui.seeElement('#component-typography');
		ui.seeElement('#component-moodboard');
		ui.seeElement('#component-video');
	})

	it ('displays a page form and passes type and component', () => {
		ui.click('#type-text-side');
		ui.click('#component-logo');
		
		ui.seeChildComponent(PageForm);
		
		ui.seeInput('input[name="type"]', 'text-side');
		ui.seeInput('input[name="component"]', 'logo');
	})

	it ('presents a list of components available for chapter type', () => {
		ui.seeElement('#pageTypes');
		ui.notSeeElement('#pageComponents');
		ui.notSeeChildComponent(PageForm);

		ui.click('#type-chapter');

		ui.notSeeElement('#pageTypes');
		ui.seeElement('#pageComponents');
		ui.notSeeChildComponent(PageForm);

		ui.seeElement('#component-none');
		ui.seeElement('#component-contacts');
	})

	it ('will not provide any component for a text page', () => {
		ui.click('#type-text');

		ui.notSeeElement('#pageTypes');
		ui.notSeeElement('#pageComponents');
		ui.seeChildComponent(PageForm);

		ui.seeInput('input[name="type"]', 'text');
		ui.seeInput('input[name="component"]', '');
	})

	it ('does not display any additional screens after successful page creation', (done) => {
		mockSuccessfulRequest();

		ui.click('#type-text');
		
		ui.type('input[name="title"]', 'Foo');
		ui.type('textarea[name="body"]', 'Bar');
		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeChildComponent(PageForm);
		}, done);
	})

	it ('emits an event after successful page creation if page type has no qualified component', (done) => {
		let returnedRecord = {id:1, title: 'Foo', body: 'Bar', type: 'text', component: ''};
		
		mockSuccessfulRequest(returnedRecord);

		ui.notExpectEvent('success');

		ui.click('#type-text');
		
		ui.type('input[name="title"]', 'Foo');
		ui.type('textarea[name="body"]', 'Bar');
		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
			ui.expectEventData('success', [returnedRecord]);
		}, done);
	})

	it ('displays logo editor for after successful page creation', (done) => {
		mockSuccessfulRequest();

		createPageWithComponent('logo');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeChildComponent(LogoEditor);
		}, done);
	})

	it ('displays colour palette editor after successful page creation', (done) => {
		mockSuccessfulRequest();

		createPageWithComponent('colour-palette');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeChildComponent(ColourPaletteEditor);
		}, done);
	})

	it ('displays typography editor after successful page creation', (done) => {
		mockSuccessfulRequest();

		createPageWithComponent('typography');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeChildComponent(TypographyEditor);
		}, done);
	})

	it ('displays moodboard editor after successful page creation', (done) => {
		mockSuccessfulRequest();

		createPageWithComponent('moodboard');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeChildComponent(MoodboardEditor);
		}, done);
	})

	it ('displays video editor after successful page creation', (done) => {
		mockSuccessfulRequest();

		createPageWithComponent('video');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeChildComponent(VideoEditor);
		}, done);
	})

	it ('sends the user back to components view if the user clicks back', () => {
		ui.click('#type-text-side');
		ui.click('#component-logo');

		ui.seeElement('#back');
		ui.click('#back');

		ui.seeElement('#pageTypes');
	})

	let bootstrapWrapper = (page) => {
		wrapper = mount(PageSteps, {
			localVue,
			store,
			propsData: {
				dataEndpoint: '/pages'
			}
		});

		ui = new TestHelper(wrapper);
	}

	let mockSuccessfulRequest = (record, override) => {
		record = record 
			? record 
			: {id:1, title: 'Foo', body: 'Bar', type: 'text', component: ''};

		ajaxHelper.stubRequest(
			/pages/, 
			ajaxHelper.getSuccessfulResponse(record, override)
		);
	}

	let createPageWithComponent = (component) => {
		ui.click('#type-text-side');
		ui.click('#component-' + component);

		ui.type('input[name="title"]', 'Foo');
		ui.type('textarea[name="body"]', 'Bar');
		ui.click('#save');
	}
})