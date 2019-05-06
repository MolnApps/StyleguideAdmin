import expect from 'expect'

class TestHelper {
	constructor(wrapper) {
		this.wrapper = wrapper;
	}

	seeChildComponent(childComponent)
	{
		expect(this.wrapper.find(childComponent).exists()).toBe(true);
	}

	notSeeChildComponent(childComponent)
	{
		expect(this.wrapper.find(childComponent).exists()).toBe(false);
	}

	emit(childComponent, eventName, data)
	{
		this.wrapper.find(childComponent).vm.$emit(eventName, data);
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
		if (value != undefined) {
			expect(this.wrapper.find(selector).element.value).toBe(value);
		} else {
			expect(this.wrapper.find(selector).exists()).toBe(true);
		}
	}

	notSeeElement(selector) {
		this.notSeeInput(selector);
	}

	seeElement(selector) {
		this.seeInput(selector);
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

	expectEvent(name) {
		expect(this.wrapper.emitted()[name]).toBeTruthy();
	}

	emitEvent(component, eventName, eventParams)
	{
		this.wrapper.find(component).vm.$emit(eventName, eventParams);
	}

	expectEventData(name, data)
	{
		expect(this.wrapper.emitted()[name][0]).toEqual(data);
	}

	notExpectEvent(name) {
		expect(this.wrapper.emitted()[name]).toBeFalsy();
	}
}

export default TestHelper;