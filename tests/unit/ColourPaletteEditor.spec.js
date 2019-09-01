// Prevent an error to display in the console.
HTMLCanvasElement.prototype.getContext = jest.fn()

import { mount, shallowMount } from '@vue/test-utils'
import ColourPaletteEditor from '@/components/ColourPaletteEditor.vue'
import ColourForm from '@/components/ColourForm.vue'
import {TestHelper, AjaxHelper, ColourHelper, StateHelper} from './../helpers/Helpers.js'
import moxios from 'moxios';
import Draggable from 'vuedraggable';

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('ColourPaletteEditor.vue', () => {
	let wrapper;
	let ui;
	let colourHelper;
	let ajaxHelper;
	let store;

	beforeEach(() => {
		colourHelper = new ColourHelper();

		store = stateHelper.freshStore();

	    wrapper = mount(ColourPaletteEditor, {
	    	localVue,
	    	store,
			propsData: { 
				dataPageColours: [], 
				dataAllColours: [], 
				dataEndpoint: '/colours',
				dataLiveUpdate: false
			}
		});

	    ui = new TestHelper(wrapper);

	    colourHelper.setTestHelper(ui).setWrapper(wrapper);
	    
	    ajaxHelper = new AjaxHelper();

	    ajaxHelper.install();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
    })

	it ('displays all colours associated with this page', () => {
		bootstrapWrapper();

		ui.see('Red', 'div.page');
		ui.see('Blue', 'div.page');
	})

	it ('displays all colours still not associated with the page', () => {
		bootstrapWrapper();

		ui.see('Green', 'div.all');
	})

	it ('can arrange colours in a different orders', () => {
		expect(wrapper.find(Draggable).exists()).toBe(true);
	})

	it ('displays a button to add new colour', () => {
		ui.seeButton('$add');
	})

	it ('displays a form when the add button is clicked', () => {
		ui.notSeeForm('#colourForm');

		ui.click('$add');

		ui.seeForm('#colourForm');
	})

	it ('hides all other elements when the add form is shown', () => {
		ui.seeElement('div.page');
		ui.seeElement('div.all');
		ui.seeButton('$add');
		ui.seeButton('$saveChanges');
		ui.seeButton('$cancelChanges');

		ui.click('$add');

		ui.notSeeElement('div.page');
		ui.notSeeElement('div.all');
		ui.notSeeButton('$add');
		ui.notSeeButton('$saveChanges');
		ui.notSeeButton('$cancelChanges');
	})

	it ('persists the colour if the save button is clicked', (done) => {
		let colour = colourHelper.make('Cyan', '#00ffff');

		mockSuccessfullRequest(colour, {id: 25});

		ui.notSee(colour.title, 'div.page');
		ui.notSee(colour.title, 'div.all');

		ui.click('$add');

		colourHelper.fillForm(colour);

		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/colours', colour);
			colourHelper.expect('Cyan', 25);
			ui.expectEvent('success');
		}, done);
	})

	it ('does not persist the colour if the cancel button is clicked', () => {
		let colour = colourHelper.make('Cyan', '#00ffff');

		ui.notSee(colour.title, 'div.page');
		ui.notSee(colour.title, 'div.all');

		ui.click('$add');

		colourHelper.fillForm(colour);

		ui.click('#cancel');

		ui.notSeeForm('#colourForm');
		ui.notSee(colour.title, 'div.page');
		ui.notSee(colour.title, 'div.all');

		ajaxHelper.expectNoRequests();
	})

	it ('displays validation errors', (done) => {
		mockRequestWithValidationErrors();

		ui.click('$add');

		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeForm('#colourForm');

			ui.see('Title is required');
			ui.see('Hex value is required');
			ui.see('RGB value is required');
			ui.see('CMYK value is required');
			ui.see('Pantone is required');
		}, done);
	})

	it ('reset the form when the save button is clicked', (done) => {
		let colour = colourHelper.make('Cyan', '#00ffff');

		mockSuccessfullRequest(colour);

		ui.click('$add');

		colourHelper.fillForm(colour);

		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.click('$add');

			ui.seeInput('input[name="title"]', '');
			ui.seeInput('input[name="hex"]', '');	
		}, done);
	})

	it ('will not affect a previously added colour when adding another colour', (done) => {
		let colour1 = colourHelper.make('Cyan', '#00ffff');
		let colour2 = colourHelper.make('Red', '#ff0000');

		colourHelper.add(colour1);

		moxios.wait(() => {
			moxios.requests.mostRecent()
	        	.respondWith(ajaxHelper.getSuccessfulResponse(colour1, {id: 25}))
	        	.then(() => {
	        		colourHelper.add(colour2);

					moxios.wait(() => {
						moxios.requests.mostRecent()
		        			.respondWith(ajaxHelper.getSuccessfulResponse(colour2, {id: 26}))
		        			.then(() => {
		        				ui.see('Cyan', 'div.page');
								ui.see('Red', 'div.page');

								done();	
		        			})
					})
	        	});
		})
	})

	it ('adds a colour from the main colour palette', () => {
		bootstrapWrapper();

		ui.notSee('Green', 'div.page');
		ui.see('Green', 'div.all');

		ui.click('div.all div[data-id="2"] .add');

		ui.see('Green', 'div.page');
		ui.notSee('Green', 'div.all');
	})

	it ('adds a colour to the library', () => {
		bootstrapWrapper();
		
		// Assuming I add a colour to the library
		ui.click('$add')
		wrapper.find(ColourForm).vm.$emit('success', colourHelper.make('Yellow', '#123456', 12));
		// Then I should see it in the .page div
		ui.see('Yellow', '.page');
		ui.notSee('Yellow', '.all');
		// When I click the remove button
		ui.click('div.page div[data-id="12"] .del');
		// I should see it in the .all div
		ui.notSee('Yellow', '.page');
		ui.see('Yellow', '.all');
	})

	it ('removes a colour from the list', () => {
		wrapper.setData({
			pageColours: [
				{id: 1, title: 'Red', hex: '#ff0000'},
				{id: 3, title: 'Blue', hex: '#0000ff'}
			]
		});
		store.dispatch('colours/initialize', {'_library': [
				{id: 1, title: 'Red', hex: '#ff0000'},
				{id: 3, title: 'Blue', hex: '#0000ff'}
		]});

		ui.see('Red', 'div.page');
		ui.see('Blue', 'div.page');

		ui.click('div.page div[data-id="3"] .del');

		ui.see('Red', 'div.page');
		ui.notSee('Blue', 'div.page');

		ui.see('Blue', 'div.all');
	})

	it ('edits an existing colour by creating a new one', (done) => {
		let newColour = colourHelper.make('Purple', '#ff00ff');
		
		mockSuccessfullRequest(newColour, {id: 25});

		bootstrapWrapper();

		ui.click('div.page div[data-id="3"] .edit');

		ui.seeForm('#colourForm');
		
		ui.seeInput('input[name="title"]', 'Blue');
		ui.seeInput('input[name="hex"]', '#0000ff');

		colourHelper.fillForm(newColour);

		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/colours', newColour);
			colourHelper.expect('Purple', 25);

			ui.see('Red', 'div.page');
			ui.see('Purple', 'div.page');
			ui.notSee('Blue', 'div.page');

			ui.see('Blue', 'div.all');
		}, done);
	})

	it ('persists the changes if the save button is clicked', (done) => {
		let newColour = colourHelper.make('Cyan', '#00ffff');

		colourHelper.bootstrapPageEndpoint({id: 12});
		bootstrapWrapper();

		colourHelper.add(newColour);

		moxios.wait(() => {
			moxios.requests.mostRecent()
	        	.respondWith(ajaxHelper.getSuccessfulResponse(newColour, {id: 25}))
	        	.then(() => {
	        		colourHelper.remove();

					ui.click('$saveChanges');

					moxios.wait(() => {
						moxios.requests.mostRecent()
		        			.respondWith({
								status: 200,
								responseText: {feedback: ['The page was updated.']}
							})
		        			.then(() => {
		        				ajaxHelper.expectRequest('/page/12/colours', {colour_id: [3, 25]});
								done()
		        			})
					})
	        	});
		})
	})

	it ('fires an event if the api call is successful', (done) => {
		mockSuccessfullRequest();

		colourHelper.bootstrapPageEndpoint({id: 12});
		bootstrapWrapper();
		
		ui.click('$saveChanges');
		
		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
		}, done);
	})

	it ('displays feedback if the api call is successful', (done) => {
		mockSuccessfullRequest();

		colourHelper.bootstrapPageEndpoint({id: 12});
		ui.click('$saveChanges');
		
		ajaxHelper.expectAfterRequest(() => {
			ui.seeFeedback();
		}, done);
	})

	it ('does not persist the changes if the cancel button is clicked', (done) => {
		bootstrapWrapper();

		let newColour = colourHelper.make('Cyan', '#00ffff');
		
		colourHelper.add(newColour);

		moxios.wait(() => {
			moxios.requests.mostRecent()
	        	.respondWith(ajaxHelper.getSuccessfulResponse(newColour, {id: 25}))
	        	.then(() => {
	        		colourHelper.remove();
		
					ui.click('$cancelChanges');
					
					moxios.wait(() => {
						expect(moxios.requests.count()).toEqual(1);
						done();
					})
	        	});
		})
	})

	it ('fires an event if the cancel button is clicked', () => {
		bootstrapWrapper();
		
		ui.click('$cancelChanges');
		
		ui.expectEvent('cancel');
	})

	it ('displays an edit button for a colour in the library', () => {
		bootstrapWrapper();

		ui.seeElement('div.all div[data-id="2"] .edit');
	})

	it ('displays a remove button for a colour in the library', () => {
		bootstrapWrapper();

		ui.seeElement('div.all div[data-id="2"] .del');
	})

	it ('displays a filled form if the edit button of a colour in the library is clicked', () => {
		bootstrapWrapper();

		ui.click('div.all div[data-id="2"] .edit');

		ui.seeForm('#colourForm');
		ui.seeInput('input[name="title"]', 'Green');
	})

	it ('updates an existing colour in the library', (done) => {
		bootstrapWrapper();

		let returnedColour = colourHelper.make('Lime', '#00ffff');

		mockSuccessfullRequest(returnedColour, {id: 2});

		ui.notSee('Lime');

		ui.click('div.all div[data-id="2"] .edit');

		ui.seeForm('#colourForm');
		
		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.see('Lime', 'div.all');
			ui.notSee('Green', 'div.all');
			ui.notSee('Lime', 'div.page');
		}, done);
	})

	it ('emits an event after updating a colour in the library', (done) => {
		bootstrapWrapper();

		let returnedColour = colourHelper.make('Lime', '#00ffff', 2);

		mockSuccessfullRequest(returnedColour);

		ui.notExpectEvent('success');

		ui.click('div.all div[data-id="2"] .edit');

		ui.seeForm('#colourForm');
		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
			ui.expectEventData('success', [returnedColour]);
		}, done);
	})

	it ('will edit a page colour after editing a library colour', (done) => {
		bootstrapWrapper();

		mockSuccessfullRequest(colourHelper.make('Lime', '#00ffff'), {id: 2});

		ui.see('Green', 'div.all');
		ui.notSee('Lime', 'div.all');

		ui.click('div.all div[data-id="2"] .edit');
		ui.seeForm('#colourForm');
		ui.click('#save');

		ajaxHelper.expectAfterRequest(() => {
			ui.notSee('Green', 'div.all');
			ui.see('Lime', 'div.all');

			ui.see('Red', 'div.page');
			ui.see('Blue', 'div.page');
			ui.notSee('Lime', 'div.page');
		}, () => {
			ui.click('div.page div[data-id="1"] .edit');

			ui.seeForm('#colourForm');
			ui.click('#save');

			ajaxHelper.expectAfterRequest(() => {
				ui.notSee('Red', 'div.page');
				ui.see('Lime', 'div.page');
				ui.see('Red', 'div.all');
			}, done)
		});
	})

	it ('performs an api call when a library colour remove button is clicked', (done) => {
		bootstrapWrapper();

		let returnedColour = colourHelper.make('Green', '#00ff00', 2);
		mockDeleteRequest(returnedColour);

		ui.see('Green', 'div.all');

		ui.click('div.all div[data-id="2"] .del');

		ajaxHelper.expectAfterRequest(() => {
			ui.notSee('Green', 'div.all');
			ajaxHelper.expectRequest('/colours/2', {'_method': 'delete'});
			ui.seeFeedback();
		}, done);
	})

	let bootstrapWrapper = () => {
		colourHelper.bootstrapColours();
		store.dispatch('colours/initialize', {
			'_library': [
				colourHelper.make('Red', '#ff0000', 1),
				colourHelper.make('Green', '#00ff00', 2),
				colourHelper.make('Blue', '#0000ff', 3)
			]
		});
	}

	let mockSuccessfullRequest = (record, override) => {
		ajaxHelper.stubRequest(/colours/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockDeleteRequest = (record, override) => {
		ajaxHelper.stubRequest(/colours/, ajaxHelper.getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		ajaxHelper.stubRequest(/colours/, ajaxHelper.getResponseWithValidationErrors({
			title: ['Title is required'],
			hex: ['Hex value is required'],
			rgb: ['RGB value is required'],
			cmyk: ['CMYK value is required'],
			pantone: ['Pantone is required'],
		}));
	}
})