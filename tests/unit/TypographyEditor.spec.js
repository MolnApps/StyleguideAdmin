import { mount, shallowMount } from '@vue/test-utils'
import TypographyEditor from '@/components/TypographyEditor.vue'
import {TestHelper, AjaxHelper, TypographyHelper, StateHelper} from './../helpers/Helpers.js'
import TypefaceFamilyForm from '@/components/TypefaceFamilyForm.vue';

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('TypographyEditor.vue', () => {
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

	it ('will not display a typeface family if all weights are associated with the page', () => {
		bootstrapWrapper(
			[typographyHelper.makeWithPivot(1, 'Rubik', [700], 700)], 
			[typographyHelper.make(1, 'Rubik', [700])]
		);

		ui.notSeeElement('div.all div');
	})

	it ('provides a way to remove typeface weights from the page', () => {
		bootstrapWrapper();

		ui.seeElement('div.page div .del');
	})

	it ('does not provide a way to remove weights from the library', () => {
		bootstrapWrapper();

		ui.notSeeElement('div.all div .del');
	})

	it ('displays a button to add a new typeface family', () => {
		bootstrapWrapper();

		ui.seeButton('$add');
	})

	it ('displays the typeface family form when the add button is clicked', () => {
		bootstrapWrapper();

		ui.click('$add');

		ui.seeForm('#typefaceFamilyForm');
	})

	it ('hides other elements when displaying the typeface family form', () => {
		bootstrapWrapper();

		ui.click('$add');

		ui.notSeeElement('div.page');
		ui.notSeeElement('div.all');
		ui.notSeeButton('$add');
	})

	it ('hides the typeface family form when the save button is clicked', () => {
		bootstrapWrapper();

		ui.click('$add');

		ui.seeForm('#typefaceFamilyForm');

		ui.emitEvent(TypefaceFamilyForm, 'success', {
			data: {
				record: typographyHelper.make(1, 'Rubik', [700, 300])
			}
		});

		ui.notSeeForm('#typefaceFamilyForm');
	})

	it ('hides the typefaces family form when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.click('$add');

		ui.seeForm('#typefaceFamilyForm');

		ui.emitEvent(TypefaceFamilyForm, 'cancel');

		ui.notSeeForm('#typefaceFamilyForm');
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

		ui.click('div.page div:nth-child(1) .del');

		ui.notSee('Rubik bold', 'div.page');
	})

	it ('library typeface families are editable', () => {
		bootstrapWrapper();

		ui.seeElement('div.all .edit');
	})

	it ('displays a form when a library typeface family edit button is clicked', () => {
		bootstrapWrapper();

		ui.click('div.all .edit');

		ui.seeForm('#typefaceFamilyForm');
	})

	it ('will disable reactivity when editing a typeface family', () => {
		bootstrapWrapper();

		ui.see('Rubik regular', 'div.all');

		ui.click('div.all .edit');

		ui.click('button.del');
		ui.click('button.del');

		ui.click('#cancel');

		ui.see('Rubik regular', 'div.all');
	})

	it ('will update the typeface family when the form is saved', (done) => {
		bootstrapWrapper();

		mockSaveSuccessfullRequest(typographyHelper.make(1, 'Rubik', [700, 300]));

		ui.notSee('Rubik bold', 'div.all');
		ui.see('Rubik regular', 'div.all');
		ui.see('Rubik light', 'div.all');

		ui.click('div.all .edit');

		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.notSee('Rubik bold', 'div.all');
			ui.notSee('Rubik regular', 'div.all');
			ui.see('Rubik light', 'div.all');
		}, done);
	})

	it ('displays a button to save the changes', () => {
		bootstrapWrapper();

		ui.seeButton('$saveChanges');
	})

	it ('displays a button to cancel the changes', () => {
		bootstrapWrapper();

		ui.seeButton('$cancelChanges');
	})

	it ('saves the changes when the save changes button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/pages/1/typefaces', {
				typeface: [
					{id: 1, weight: 700},
					{id: 2, weight: 300},
				]
			})
		}, done);
	})

	it ('displays feedback when the save changes button is clicked', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.notSee('The page was updated');

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.see('The page was updated');
		}, done);
	})

	it ('does not save the changes when the cancel button is clicked', () => {
		bootstrapWrapper();

		ui.click('$cancelChanges');

		ajaxHelper.expectNoRequests()
	})

	it ('fires an event when the changes are saved', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest();

		ui.click('$saveChanges');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('fires and event when the changes are cancelled', () => {
		bootstrapWrapper();

		ui.click('$cancelChanges');

		ui.expectEvent('cancel');
	})

	it ('will not break if the pivot contains a weight that does not exist', () => {
		bootstrapWrapper([
			typographyHelper.makeWithPivot('1', 'Rubik', [700, 400, 300], 500)
		]);

		expect(wrapper.find('div.page div').exists()).toBe(false);
	})

	let bootstrapWrapper = (pageTypefaceFamilies, allTypefaceFamilies) => {
		pageTypefaceFamilies = pageTypefaceFamilies ? pageTypefaceFamilies : [
			typographyHelper.makeWithPivot(1, 'Rubik', [700, 400, 300], 700),
			typographyHelper.makeWithPivot(2, 'Roboto', [400, 300], 300)
		];

		allTypefaceFamilies = allTypefaceFamilies ? allTypefaceFamilies : [
			typographyHelper.make(1, 'Rubik', [700, 400, 300]),
			typographyHelper.make(2, 'Roboto', [400, 300])
		];

		wrapper = mount(TypographyEditor, {
			localVue,
			store,
			propsData: {
				dataPageTypefaceFamilies: pageTypefaceFamilies,
				dataAllTypefaceFamilies: allTypefaceFamilies,
				dataEndpoint: '/pages/1/typefaces'
			}
		});

		ui = new TestHelper(wrapper);
	    
	    typographyHelper.setWrapper(wrapper).setTestHelper(ui);
	}

	let mockSuccessfullRequest = (record, override) => {
		ajaxHelper.stubRequest(/typefaces/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockSaveSuccessfullRequest = (record, override) => {
		ajaxHelper.stubRequest(/typography/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/typefaces/, ajaxHelper.getResponseWithValidationErrors({}));
	}
})