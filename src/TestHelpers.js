import expect from 'expect'

class TestUI {
	constructor(wrapper) {
		this.wrapper = wrapper;
	}
	
	see(text, selector) {
		let node = selector ? this.wrapper.find(selector) : this.wrapper;

		expect(node.html()).toContain(text);
	}

	notSee(text, selector) {
		let node = selector ? this.wrapper.find(selector) : this.wrapper;

		expect(node.html()).not.toContain(text);
	}

	notSeeInput(selector) {
		expect(this.wrapper.find(selector).exists()).toBe(false)
	}

	seeInput(selector, value) {
		if (value) {
			expect(this.wrapper.find(selector).element.value).toBe(value);
		} else {
			expect(this.wrapper.find(selector)).toBeTruthy();
		}
	}

	seeForm(selector) {
		expect(this.wrapper.find('form' + selector).exists()).toBe(true);
	}

	notSeeForm(selector) {
		expect(this.wrapper.find('form' + selector).exists()).toBe(false);
	}

	click(selector) {
		this.wrapper.find(selector).trigger('click');
	}

	type(selector, value) {
		let node = this.wrapper.find(selector);

		node.element.value = value;
		node.trigger('input');
	}
}

export default TestUI;