import { mount, shallowMount } from '@vue/test-utils'
import Page from '@/components/Page.vue'
import PageForm from '@/components/PageForm.vue'
import {TestHelper} from './../helpers/Helpers.js'

describe('Page.vue', () => {
	let wrapper;
	let ui;

	beforeEach(() => {
		wrapper = shallowMount(Page, {
			propsData: { 
				dataPage: {title:'Foo', body: 'Bar'}
			}
	    });

	    ui = new TestHelper(wrapper);
	})

	it('displays a page markup', () => {
		ui.see('Foo');
		ui.see('Bar');
	})

	it('displays an edit button', () => {
		ui.seeInput('#edit');
	})

	it('displays a form when the edit button is clicked', () => {
		ui.notSeeForm('#pageForm');

		ui.click('#edit');

		ui.seeChildComponent(PageForm);
	})

	it('hides the form when the form is submitted', () => {
		ui.click('#edit');

		ui.seeChildComponent(PageForm);

		wrapper.find(PageForm).vm.$emit('success', {});

		ui.notSeeChildComponent(PageForm);
	})

	it('refreshes the page when the form is submitted with success', () => {
		let attr = {title: 'Foobar', body: 'Barbaz'};

    	ui.notSee(attr.title);
    	ui.notSee(attr.body);

    	ui.click('#edit');

    	ui.emit(PageForm, 'success', attr);

    	ui.see(attr.title);
    	ui.see(attr.body);
    })

    it('hides the form when the cancel button is clicked', () => {
		ui.click('#edit');

		ui.seeChildComponent(PageForm);

		ui.emit(PageForm, 'cancel');

		ui.notSeeChildComponent(PageForm);
	})

	it('does not update the page when the cancel button is clicked', () => {
		let before = wrapper.html();

		ui.click('#edit');

		ui.emit(PageForm, 'cancel');

		expect(wrapper.html()).toBe(before);
	})
})