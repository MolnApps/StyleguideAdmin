import { mount, shallowMount } from '@vue/test-utils'
import ColourForm from '@/components/ColourForm.vue'
import {Sketch} from 'vue-color';
import {TestHelper, AjaxHelper, ColourHelper, StateHelper} from './../helpers/Helpers.js'

import hex2pantone from '@/HexToPantone.js';

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('ColourForm.vue', () => {
	let wrapper;
	let ui;
	let colourHelper;
	let ajaxHelper;
	let store;

	beforeEach(() => {
		colourHelper = new ColourHelper();
	    
	    bootstrapComponent();

	    ajaxHelper = new AjaxHelper();

	    ajaxHelper.install();
	})

	afterEach(() => {
		ajaxHelper.uninstall();
    })

    it ('displays a form', () => {
    	ui.seeForm('#colourForm');
    })

    it ('does not fill the inputs if a new colour is passed', () => {
    	bootstrapComponent(colourHelper.make('', ''));

		ui.seeInput('input[name="title"]', '');
		ui.seeInput('input[name="hex"]', '');
		ui.seeInput('input[name="rgb"]', '');
		ui.seeInput('input[name="cmyk"]', '');
		ui.seeInput('input[name="pantone"]', '');
	})

	it ('fills the inputs if a colour is passed', () => {
		ui.seeInput('input[name="title"]', 'Red');
		ui.seeInput('input[name="hex"]', '#ff0000');
		ui.seeInput('input[name="rgb"]', '');
		ui.seeInput('input[name="cmyk"]', '');
		ui.seeInput('input[name="pantone"]', '');
	})

	it ('displays a save button', () => {
		ui.seeButton('$save');
	})

	it ('displays a cancel button', () => {
		ui.seeButton('$cancel');
	})

	it ('perform an api call when the colour does not exists', (done) => {
		bootstrapComponent(colourHelper.make('', ''));

		mockSuccessfullRequest({});

		ui.notExpectEvent('success');

		ui.type('input[name="title"]', 'Red');
		ui.type('input[name="hex"]', '#ff0000');
		ui.type('input[name="rgb"]', '255 0 0');
		ui.type('input[name="cmyk"]', '100 100 0 0');
		ui.type('input[name="pantone"]', 'Pantone 195 C');
		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/colours', {
				title: 'Red',
				hex: '#ff0000', 
				rgb: '255 0 0', 
				cmyk: '100 100 0 0', 
				pantone: 'Pantone 195 C'
			});
		}, done);
	})

	it ('performs an api call when the colour exists', (done) => {
		mockSuccessfullRequest({});

		ui.notExpectEvent('success');

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ajaxHelper.expectRequest('/colours/1', {
				title: 'Red',
				hex: '#ff0000', 
				rgb: '',
				cmyk: '', 
				pantone: ''
			});
		}, done);
	})

	it ('fires an event after a successful api call', (done) => {
		let returnedColour = colourHelper.make('Orange', '#ffff00', 25);

		mockSuccessfullRequest(returnedColour);

		ui.notExpectEvent('success');

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.expectEvent('success');
			ui.expectEventData('success', [returnedColour])
		}, done);
	})

	it ('fires an event when the cancel button is clicked', () => {
		ui.notExpectEvent('cancel');

		ui.click('$cancel');

		ui.expectEvent('cancel');
	})

	it ('displays feedback after a successful api call', (done) => {
		let returnedColour = colourHelper.make('Orange', '#ffff00', 25);

		mockSuccessfullRequest(returnedColour);

		ui.notSeeBusFeedback();

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeBusFeedback();
		}, done);
	})

	it ('resets the form when the cancel button is clicked', () => {
		ui.seeInput('input[name="title"]', 'Red');
		ui.seeInput('input[name="hex"]', '#ff0000');
		ui.seeInput('input[name="rgb"]', '');
		ui.seeInput('input[name="cmyk"]', '');
		ui.seeInput('input[name="pantone"]', '');

		ui.type('input[name="title"]', 'Blue');
		ui.type('input[name="hex"]', '#0000ff');
		ui.type('input[name="rgb"]', '0 0 255');
		ui.type('input[name="cmyk"]', '100 0 0 100');
		ui.type('input[name="pantone"]', 'Pantone 192 C');

		ui.click('$cancel');

		ui.seeInput('input[name="title"]', 'Red');
		ui.seeInput('input[name="hex"]', '#ff0000');
		ui.seeInput('input[name="rgb"]', '');
		ui.seeInput('input[name="cmyk"]', '');
		ui.seeInput('input[name="pantone"]', '');
	})

	it ('resets the form after a successful api call', (done) => {
		mockSuccessfullRequest(colourHelper.make('Orange', '#ffff00', 25));

		ui.seeInput('input[name="title"]', 'Red');
		ui.seeInput('input[name="hex"]', '#ff0000');
		ui.seeInput('input[name="rgb"]', '');
		ui.seeInput('input[name="cmyk"]', '');
		ui.seeInput('input[name="pantone"]', '');

		ui.type('input[name="title"]', 'Blue');
		ui.type('input[name="hex"]', '#0000ff');
		ui.type('input[name="rgb"]', '0 0 255');
		ui.type('input[name="cmyk"]', '100 0 0 100');
		ui.type('input[name="pantone"]', 'Pantone 192 C');

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.seeInput('input[name="title"]', 'Orange');
			ui.seeInput('input[name="hex"]', '#ffff00');
			ui.seeInput('input[name="rgb"]', '');
			ui.seeInput('input[name="cmyk"]', '');
			ui.seeInput('input[name="pantone"]', '');
		}, done);
	})

	it ('displays validation errors', (done) => {
		mockRequestWithValidationErrors();

		ui.click('$save');

		ajaxHelper.expectAfterRequest(() => {
			ui.see('Title is required');
			ui.see('Hex value is required');
			ui.see('RGB value is required');
			ui.see('CMYK value is required');
			ui.see('Pantone is required');
		}, done);
	})

	it ('displays a colour picker', () => {
		expect(wrapper.find(Sketch).exists()).toBe(true);
	})

	it ('automatically updates the colours when the hex value changes', () => {
		bootstrapComponent({title: '', hex: '', rgb: '', cmyk: '', pantone: ''});
		wrapper.setData({liveUpdate: true});

		ui.seeInput('input[name="title"]', '');
		ui.seeInput('input[name="rgb"]', '');
		ui.seeInput('input[name="cmyk"]', '');
		ui.seeInput('input[name="pantone"]', '');

		ui.type('input[name="hex"]', '#0099ff');

		ui.seeInput('input[name="title"]', 'Dodger Blue');
		ui.seeInput('input[name="rgb"]', '0 153 255');
		ui.seeInput('input[name="cmyk"]', '100 40 0 0');
		ui.seeInput('input[name="pantone"]', 'Pantone 2925 C');
	})

	it ('will not override existing colours when the hex value changes', () => {
		bootstrapComponent({title: 'Red', hex: '#ff0000', rgb: '255 0 0', cmyk: '0 100 100 0', pantone: 'foobar'});
		wrapper.setData({liveUpdate: true});

		ui.seeInput('input[name="title"]', 'Red');
		ui.seeInput('input[name="rgb"]', '255 0 0');
		ui.seeInput('input[name="cmyk"]', '0 100 100 0');
		ui.seeInput('input[name="pantone"]', 'foobar');

		ui.type('input[name="hex"]', '#0099ff');

		ui.seeInput('input[name="title"]', 'Red');
		ui.seeInput('input[name="rgb"]', '255 0 0');
		ui.seeInput('input[name="cmyk"]', '0 100 100 0');
		ui.seeInput('input[name="pantone"]', 'foobar');
	})

	it ('will override existing colours if they were generated in this session', () => {
		bootstrapComponent({title: '', hex: '', rgb: '', cmyk: '', pantone: ''});
		wrapper.setData({liveUpdate: true});

		ui.seeInput('input[name="title"]', '');
		ui.seeInput('input[name="rgb"]', '');
		ui.seeInput('input[name="cmyk"]', '');
		ui.seeInput('input[name="pantone"]', '');

		ui.type('input[name="hex"]', '#0099ff');

		ui.seeInput('input[name="title"]', 'Dodger Blue');
		ui.seeInput('input[name="rgb"]', '0 153 255');
		ui.seeInput('input[name="cmyk"]', '100 40 0 0');
		ui.seeInput('input[name="pantone"]', 'Pantone 2925 C');

		ui.type('input[name="hex"]', '#ff00ff');

		ui.seeInput('input[name="title"]', 'Magenta / Fuchsia');
		ui.seeInput('input[name="rgb"]', '255 0 255');
		ui.seeInput('input[name="cmyk"]', '0 100 0 0');
		ui.seeInput('input[name="pantone"]', 'Pantone 807 C');
	})

	it ('displays a auto-update checkbox', () => {
		ui.seeInput('input[type="checkbox"][id="liveUpdate"]');
	})

	it ('auto-update is checked the colours will be overridden', () => {
		bootstrapComponent({title: '', hex: '', rgb: '', cmyk: '', pantone: ''});
		
		wrapper.find('#liveUpdate').trigger('change');

		ui.seeInput('input[name="title"]', '');
		ui.seeInput('input[name="rgb"]', '');
		ui.seeInput('input[name="cmyk"]', '');
		ui.seeInput('input[name="pantone"]', '');

		ui.type('input[name="hex"]', '#0099ff');

		ui.seeInput('input[name="title"]', 'Dodger Blue');
		ui.seeInput('input[name="rgb"]', '0 153 255');
		ui.seeInput('input[name="cmyk"]', '100 40 0 0');
		ui.seeInput('input[name="pantone"]', 'Pantone 2925 C');
	})

	let bootstrapComponent = (colour) => {
		colour = colour ? colour : colourHelper.make('Red', '#ff0000', 1);
		
		wrapper = shallowMount(ColourForm, {
			propsData: { 
				dataColour: colour, 
				dataEndpoint: '/colours',
				dataLiveUpdate: false
			}
		});

		ui = new TestHelper(wrapper);
		colourHelper.setTestHelper(ui).setWrapper(wrapper);

		stateHelper.propagateFeedback(wrapper);
	}

	let mockSuccessfullRequest = (record, override) => {
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