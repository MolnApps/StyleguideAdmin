import { mount, shallowMount } from '@vue/test-utils'
import PageSteps from '@/components/PageSteps.vue'
import PageForm from '@/components/PageForm.vue'
import ChapterForm from '@/components/ChapterForm.vue'
import LogoEditor from '@/components/LogoEditor.vue'
import {TestHelper, AjaxHelper} from './../helpers/Helpers.js'

describe('PageSteps.vue', () => {
	let wrapper;
	let ui;
	let ajaxHelper;

	beforeEach(() => {
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
		
		ui.seeElement('#component-none');
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

	it ('displays logo editor for after successful page creation', (done) => {
		mockSuccessfulRequest();

		ui.click('#type-text-side');
		ui.click('#component-logo');

		ui.type('input[name="title"]', 'Foo');
		ui.type('textarea[name="body"]', 'Bar');
		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeChildComponent(LogoEditor);
		}, done);
	})

	let bootstrapWrapper = (page) => {
		wrapper = mount(PageSteps, {
			propsData: {
				dataEndpoint: '/pages'
			}
		});

		ui = new TestHelper(wrapper);
	}

	let mockSuccessfulRequest = () => {
		ajaxHelper.stubRequest(
			/pages/, 
			ajaxHelper.getSuccessfulResponse({id:1, title: 'Foo', body: 'Bar', type: 'text', component: ''})
		);
	}
})