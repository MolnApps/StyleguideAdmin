import { mount, shallowMount } from '@vue/test-utils'
import TypographyEditor from '@/components/TypographyEditor.vue'
import {TestHelper, AjaxHelper, TypographyHelper} from './../helpers/Helpers.js'
import TypefaceFamilyForm from '@/components/TypefaceFamilyForm.vue';

describe('TypographyEditor.vue', () => {
	let wrapper;
	let ui;
	let typographyHelper;
	let ajaxHelper;

	beforeEach(() => {
		typographyHelper = new TypographyHelper();

	    ajaxHelper = new AjaxHelper();

	    ajaxHelper.install();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
    })

	it ('displays all typeface weights associated with the page', () => {
		bootstrapWrapper();

		ui.see('Rubik bold', 'div.page');
		ui.notSee('Rubik regular', 'div.page');
		ui.notSee('Rubik Light', 'div.page');
		
		ui.notSee('Roboto regular', 'div.page');
		ui.see('Roboto light', 'div.page');
	})

	it ('displays in the library only typeface weights still not associated with the page', () => {
		bootstrapWrapper();

		ui.notSee('Rubik bold', 'div.all');
		ui.see('Rubik regular', 'div.all');
		ui.see('Rubik light', 'div.all');
		
		ui.see('Roboto regular', 'div.all');
		ui.notSee('Roboto light', 'div.all');
	})

	it ('provides a way to remove typeface weights from the page', () => {
		bootstrapWrapper();

		ui.seeElement('div.page div span.del');
	})

	it ('does not provide a way to remove weights from the library', () => {
		bootstrapWrapper();

		ui.notSeeElement('div.all div span.del');
	})

	it ('displays a button to add a new typeface family', () => {
		bootstrapWrapper();

		ui.seeInput('button[id="add"]');
	})

	it ('displays the typeface family form when the add button is clicked', () => {
		bootstrapWrapper();

		ui.click('#add');

		ui.seeForm('#typefaceFamilyForm');
	})

	it ('hides other elements when displaying the typeface family form', () => {
		bootstrapWrapper();

		ui.click('#add');

		ui.notSeeElement('div.page');
		ui.notSeeElement('div.all');
		ui.notSeeElement('#add');
	})

	it ('hides the typeface family form when the save button is clicked', () => {
		bootstrapWrapper();

		ui.click('#add');

		ui.seeForm('#typefaceFamilyForm');

		ui.emitEvent(TypefaceFamilyForm, 'success');

		ui.notSeeForm('#typefaceFamilyForm');
	})

	it ('hides the typefaces family form when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.click('#add');

		ui.seeForm('#typefaceFamilyForm');

		ui.emitEvent(TypefaceFamilyForm, 'cancel');

		ui.notSeeForm('#typefaceFamilyForm');
	})

	it ('adds a typeface family from the library on click', () => {
		
	})

	it ('adds a typeface family weight from the library on click', () => {
		bootstrapWrapper();

		ui.notSee('Rubik regular', 'div.page');

		ui.click('div.all div:nth-child(1) div:nth-child(1) div');

		ui.see('Rubik regular', 'div.page');
	})

	it ('it clones library typeface families when adding to the page', () => {
		bootstrapWrapper();

		ui.notSee('Rubik bold', 'div.all');
		ui.see('Rubik regular', 'div.all');
		ui.see('Rubik light', 'div.all');

		ui.click('div.all div:nth-child(1) div:nth-child(1) div');
		
		ui.notSee('Rubik bold', 'div.all');
		ui.notSee('Rubik regular', 'div.all');
		ui.see('Rubik light', 'div.all');

		ui.click('div.all div:nth-child(1) div:nth-child(1) div');
		
		ui.notSee('Rubik bold', 'div.all');
		ui.notSee('Rubik regular', 'div.all');
		ui.notSee('Rubik light', 'div.all');
	})

	it ('removes a typeface family weight from the page', () => {
		bootstrapWrapper();

		ui.see('Rubik bold', 'div.page');

		ui.click('div.page div:nth-child(1) span.del');

		ui.notSee('Rubik bold', 'div.page');
	})

	it ('displays a button to save the changes', () => {
		bootstrapWrapper();

		ui.seeInput('button[id="saveChanges"]');
	})

	it ('displays a button to cancel the changes', () => {
		bootstrapWrapper();

		ui.seeInput('button[id="cancelChanges"]');
	})

	it ('saves the changes when the save changes button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.click('#saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/pages/1/typefaces', {
				typeface: [
					{id: 1, weight: 700},
					{id: 2, weight: 300},
				]
			})
		}, done);
	})

	it ('does not save the changes when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.click('#cancelChanges');

		ajaxHelper.expectNoRequests()
	})

	it ('fires an event when the changes are saved', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.click('#saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('fires and event when the changes are cancelled', () => {
		bootstrapWrapper();

		ui.click('#cancelChanges');

		ui.expectEvent('cancel');
	})

	it ('will not break if the pivot contains a weight that does not exist', () => {
		bootstrapWrapper([
			typographyHelper.makeWithPivot('1', 'Rubik', [700, 400, 300], 500)
		]);

		expect(wrapper.find('div.page div').exists()).toBe(false);
	})

	let bootstrapWrapper = (pageTypefaceFamilies) => {
		pageTypefaceFamilies = pageTypefaceFamilies ? pageTypefaceFamilies : [
			typographyHelper.makeWithPivot(1, 'Rubik', [700, 400, 300], 700),
			typographyHelper.makeWithPivot(2, 'Roboto', [400, 300], 300)
		];

		let allTypefaceFamilies = [
			typographyHelper.make(1, 'Rubik', [700, 400, 300]),
			typographyHelper.make(2, 'Roboto', [400, 300])
		];

		wrapper = mount(TypographyEditor, {
			propsData: {
				dataPageTypefaceFamilies: pageTypefaceFamilies,
				dataAllTypefaceFamilies: allTypefaceFamilies,
				endpoint: '/pages/1/typefaces'
			}
		});

		ui = new TestHelper(wrapper);
	    
	    typographyHelper.setWrapper(wrapper).setTestHelper(ui);
	}

	let mockSuccessfullRequest = (record, override) => {
		ajaxHelper.stubRequest(/typefaces/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/typefaces/, ajaxHelper.getResponseWithValidationErrors({}));
	}
})