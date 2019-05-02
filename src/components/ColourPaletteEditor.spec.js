import { shallowMount } from '@vue/test-utils'
import ColourPaletteEditor from '@/components/ColourPaletteEditor.vue'
import TestUI from '@/TestHelpers.js'
import moxios from 'moxios';
import axios from 'axios';

describe('ColourPaletteEditor.vue', () => {
	let wrapper;
	let ui;

	beforeEach(() => {
		wrapper = shallowMount(ColourPaletteEditor, {
			propsData: { 
				dataPageColours: [], 
				dataAllColours: [], 
				dataEndpoint: '/colours'
			}
		});

	    ui = new TestUI(wrapper);

	    moxios.install();
	})

	afterEach(() => {
		moxios.uninstall();
    })

	it ('displays all colours associated with this page', () => {
		bootstrapWrapperColours();

		ui.see('Red', 'div.page');
		ui.see('Blue', 'div.page');
	})

	it ('displays all colours still not associated with the page', () => {
		bootstrapWrapperColours();

		ui.see('Green', 'div.all');
	})

	it ('can arrange colours in a different orders', () => {
		
	})

	it ('displays a button to add new colour', () => {
		ui.seeInput('button[id="add"]');
	})

	it ('displays a form when the add button is clicked', () => {
		ui.seeInput('button[id="add"]');
		ui.notSeeForm('#colourForm');

		ui.click('#add');

		ui.notSeeInput('button[id="add"]');
		ui.seeForm('#colourForm');
		ui.seeInput('input[name="title"]');
		ui.seeInput('input[name="hex"]');
		ui.seeInput('input[name="rgb"]');
		ui.seeInput('input[name="cmyk"]');
		ui.seeInput('input[name="pantone"]');
		ui.seeInput('button[id="save"]');
	})

	it ('adds the colour if the save button is clicked', (done) => {
		let colour = makeColour('Cyan', '#00ffff');

		mockSuccessfullRequest(colour, {id: 25});

		ui.notSee(colour.title, 'div.page');
		ui.notSee(colour.title, 'div.all');

		ui.click('#add');

		fillColourForm(colour);

		ui.click('#save');

		moxios.wait(() => {
			expectRequest('/colours', colour);
			expectColour('Cyan', 25);
			done();
		});
	})

	it ('displays validation errors', (done) => {
		mockRequestWithValidationErrors();

		ui.click('#add');

		ui.click('#save');

		moxios.wait(() => {
			ui.seeForm('#colourForm');

			ui.see('Title is required');
			ui.see('Hex value is required');
			ui.see('RGB value is required');
			ui.see('CMYK value is required');
			ui.see('Pantone is required');
			
			done();
		});
	})

	it ('reset the form when the save button is clicked', (done) => {
		let colour = makeColour('Cyan', '#00ffff');

		mockSuccessfullRequest(colour);

		ui.click('#add');

		fillColourForm(colour);

		ui.click('#save');

		moxios.wait(() => {
			ui.click('#add');

			ui.seeInput('input[name="title"]', '');
			ui.seeInput('input[name="hex"]', '');	

			done();
		});
	})

	it ('will not affect a previously added colour when adding another colour', (done) => {
		let colour1 = makeColour('Cyan', '#00ffff');
		let colour2 = makeColour('Red', '#ff0000');

		addColour(colour1);

		moxios.wait(() => {
			moxios.requests.mostRecent()
	        	.respondWith(getSuccessfulResponse(colour1, {id: 25}))
	        	.then(() => {
	        		addColour(colour2);

					moxios.wait(() => {
						moxios.requests.mostRecent()
		        			.respondWith(getSuccessfulResponse(colour2, {id: 26}))
		        			.then(() => {
		        				ui.see('Cyan', 'div.page');
								ui.see('Red', 'div.page');

								done();	
		        			})
					})
	        	});
		})
	})

	it ('removes a colour from the list', () => {
		wrapper.setData({
			pageColours: [
				{id: 1, title: 'Red', hex: '#ff0000'},
				{id: 3, title: 'Blue', hex: '#0000ff'}
			],
			allColours: [
				{id: 1, title: 'Red', hex: '#ff0000'},
				{id: 3, title: 'Blue', hex: '#0000ff'}
			]
		});

		ui.see('Red', 'div.page');
		ui.see('Blue', 'div.page');

		ui.click('div.page div[data-id="3"] span.del');

		ui.see('Red', 'div.page');
		ui.notSee('Blue', 'div.page');

		ui.see('Blue', 'div.all');
	})

	it ('edits an existing colour by creating a new one', (done) => {
		let newColour = makeColour('Purple', '#ff00ff');
		
		mockSuccessfullRequest(newColour, {id: 25});

		bootstrapWrapperColours();

		ui.click('div.page div[data-id="3"] span.edit');

		ui.seeForm('#colourForm');
		
		ui.seeInput('input[name="title"]', 'Blue');
		ui.seeInput('input[name="hex"]', '#0000ff');

		fillColourForm(newColour);
		
		ui.click('#save');

		moxios.wait(() => {
			expectRequest('/colours', newColour);
			expectColour('Purple', 25);

			ui.see('Red', 'div.page');
			ui.see('Purple', 'div.page');
			ui.notSee('Blue', 'div.page');

			ui.see('Blue', 'div.all');

			done();
		})
	})

	it ('persists the changes if the save button is clicked', (done) => {
		let newColour = makeColour('Cyan', '#00ffff');

		mockSuccessfullRequest(newColour, {id: 25});

		bootstrapWrapperColours();

		addColour(newColour);
		removeColour();

		ui.click('#persist');

		moxios.wait(function () {
			expectRequest('/colours', {foo: 'bar'});
			done()
		})
	})

	it ('fires an event if the api call is successful', (done) => {
		mockSuccessfullRequest();

		bootstrapWrapperColours();
		
		ui.click('#persist');
		
		moxios.wait(function () {
			expectEvent('success');
			done()
		})
	})

	it ('does not persist the changes if the cancel button is clicked', () => {
		bootstrapWrapperColours();
		
		addColour();
		removeColour();
		
		ui.click('#cancel');
		
		expect(moxios.requests.mostRecent()).toBeFalsy();
	})

	it ('fires an event if the cancel button is clicked', () => {
		bootstrapWrapperColours();
		
		ui.click('#cancel');
		
		expectEvent('cancel');
	})

	let mockSuccessfullRequest = (record, override) => {
		moxios.stubRequest(/colours/, getSuccessfulResponse(record, override));
	}

	let mockRequestWithValidationErrors = () => {
		moxios.stubRequest(/colours/, {
			status: 403,
			responseText: {
				errors: {
					title: ['Title is required'],
					hex: ['Hex value is required'],
					rgb: ['RGB value is required'],
					cmyk: ['CMYK value is required'],
					pantone: ['Pantone is required'],
				}
			}
		});
	}

	let getSuccessfulResponse = (record, override) => {
		if (record) {
			record = JSON.parse(JSON.stringify(record));
			Object.assign(record, override);
		}

		return {
			status: 200,
			responseText: {
				feedback: ['The page was updated.'],
				record: record
			}
		};
	}

	let expectRequest = (url, params) => {
		let request = moxios.requests.mostRecent();
		expect(request.config.url).toEqual(url);
		expect(JSON.parse(request.config.data)).toEqual(params);
	}

	let expectEvent = (name) => {
		expect(wrapper.emitted()[name]).toBeTruthy()
	}

	let expectColour = (title, id) => {
		ui.see(title, 'div.page');
		expect(wrapper.find('div.page div[data-id="' + id + '"]').exists()).toBe(true);
	}

	let bootstrapWrapperColours = () => {
		wrapper.setData({
			pageColours: [
				makeColour('Red', '#ff0000', 1),
				makeColour('Blue', '#0000ff', 3)
			],
			allColours: [
				makeColour('Red', '#ff0000', 1),
				makeColour('Green', '#00ff00', 2),
				makeColour('Blue', '#0000ff', 3)
			]
		});
	}

	let makeColour = (title, hex, id) => {
		return {
			title: title, 
			hex: hex,
			rgb: '',
			cmyk: '',
			pantone: '',
			id: id ? id : ''
		};
	}

	let addColour = (colour) => {
		if (! colour) {
			colour = makeColour('Cyan', '#00ffff');
		}
		
		ui.click('#add');
		fillColourForm(colour);
		ui.click('#save');
	}

	let removeColour = () => {
		ui.click('div.page div[data-id="1"] span.del');
	}

	let fillColourForm = (colour) => {
		ui.type('input[name="title"]', colour.title);
		ui.type('input[name="hex"]', colour.hex);
	}
})