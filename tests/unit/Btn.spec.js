import { mount, shallowMount } from '@vue/test-utils'
import Btn from '@/components/Btn.vue'
import {TestHelper, StateHelper} from './../helpers/Helpers.js'

let stateHelper = new StateHelper();
let localVue = stateHelper.localVue;

describe('Btn.vue', () => {
	let wrapper;
	let ui;
	let store;

	beforeEach(() => {
		store = stateHelper.freshStore();
	})
	
	it ('displays a primary large button by default', () => {
		bootstrapComponent({});

		ui.see('Button ');
		ui.see('Button--primary');
		ui.see('Button--xl');
		ui.see('Button--enabled');
	})

	it ('provides a way to change button type', () => {
		bootstrapComponent({type: 'secondary'});

		ui.notSee('Button--primary');
		ui.see('Button--secondary');
	})

	it ('provides a way to change button size', () => {
		bootstrapComponent({size: 'xs'});

		ui.notSee('Button--xl');
		ui.see('Button--xs');
	})

	it ('adds a loading class to an asynch button when it is clicked', () => {
		bootstrapComponent({asynch: true});

		ui.click('button');

		ui.see('Button--loading');
		ui.notSee('Button--disabled');
	})

	it ('resets the asynch button when the bus emits an event', () => {
		bootstrapComponent({asynch: true});

		ui.see('Button--enabled');
		ui.notSee('Button--disabled');
		ui.notSee('Button--loading');

		ui.click('button');

		ui.see('Button--loading');
		ui.notSee('Button--enabled');
		ui.notSee('Button--disabled');

		stateHelper.emit('success');

		ui.see('Button--enabled');
		ui.notSee('Button--disabled');
		ui.notSee('Button--loading');
	})

	it ('will not freeze the ui if the button is not asynch', () => {
		bootstrapComponent({asynch: false});

		expect(store.state.status).toBe('enabled');

		ui.click('button');

		expect(store.state.status).toBe('enabled');
	})

	it ('freezes all buttons when clicked', () => {
		bootstrapComponent({asynch: true});

		expect(store.state.status).toBe('enabled');

		ui.click('button');

		expect(store.state.status).toBe('disabled');
	})

	it ('emits an event when clicked', () => {
		bootstrapComponent();

		ui.notExpectEvent('click');

		ui.click('button'),

		ui.expectEvent('click');
	})

	it ('will disable the button until the asynch action was performed', () => {
		bootstrapComponent({asynch: true});

		ui.click('button');
		ui.expectEvent('click', 1);

		ui.click('button');
		ui.expectEvent('click', 1),

		stateHelper.emit('success');
		ui.click('button');
		ui.expectEvent('click', 2);
	})

	let bootstrapComponent = (props) => {
		wrapper = shallowMount(Btn, {
			localVue,
			store,
			propsData: props
		});

		ui = new TestHelper(wrapper);
	}
})