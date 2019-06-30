import { mount, shallowMount } from '@vue/test-utils'
import {TestHelper} from './../helpers/Helpers.js'
import Feedback from '@/components/Feedback.vue'

describe('Feedback.vue', () => {
	let wrapper;
	let ui;
	let store;

	beforeEach(() => {
		jest.useFakeTimers();
	})
	
	it ('displays feedback', () => {
		bootstrapComponent({dataFeedback: ['Foo bar baz']});

		ui.see('Foo bar baz');
	})

	it ('resets the feedback after a default time of 5 seconds', () => {
		bootstrapComponent({dataFeedback: ['Foo bar baz']});

		expect(setTimeout).toHaveBeenCalledTimes(2);
  		expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 5000);
	})

	it.only ('resets the feedback after a default time', () => {
		bootstrapComponent({dataFeedback: ['Foo bar baz']});

		ui.see('Foo bar baz');
		ui.see('animated-opacity');
		ui.see('hide-opacity');

		jest.advanceTimersByTime(1);

		ui.see('Foo bar baz');
		ui.see('animated-opacity');
		ui.see('show-opacity');

  		jest.runAllTimers();

  		ui.see('Foo bar baz');
		ui.see('animated-opacity');
		ui.see('hide-opacity');
	})

	it ('will not reset the feedback if the time preference is set to 0', () => {
		bootstrapComponent({dataFeedback: ['Foo bar baz'], dataDuration: 0});

		ui.see('Foo bar baz');

  		jest.runAllTimers();

  		ui.see('Foo bar baz');
	})

	it ('will not reset the feedback if the time preference is set to 0 string', () => {
		bootstrapComponent({dataFeedback: ['Foo bar baz'], dataDuration: '0'});

		ui.see('Foo bar baz');

  		jest.runAllTimers();

  		ui.see('Foo bar baz');
	})

	let bootstrapComponent = (props) => {
		wrapper = shallowMount(Feedback, {
			propsData: props
		});

		ui = new TestHelper(wrapper);
	}
})