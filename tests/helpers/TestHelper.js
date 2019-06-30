import expect from 'expect'

class TestHelper {
	constructor(wrapper) {
		this.wrapper = wrapper;
	}

	notSeeFeedback()
	{
		this.notExpectEvent('feedback');
	}

	seeFeedback(message)
	{
		message = message ? message : 'The page was updated.';
		this.expectEvent('feedback');
		this.expectEventData('feedback', [[message]]);
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
			expect(this.find(selector).element.value).toBe(value);
		} else {
			expect(this.find(selector).exists()).toBe(true);
		}
	}

	notSeeButton(ref)
	{
		expect(this.find(ref)).toBeFalsy();
	}

	seeButton(ref)
	{
		expect(this.find(ref)).toBeTruthy();
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
		if (this.isRef(selector)) {
			return this.find(selector).$emit('click');
		}
		return this.find(selector).trigger('click');
	}

	isRef(selectorOrRef) {
		if (typeof selectorOrRef === 'string' || selectorOrRef instanceof String) {
			return selectorOrRef.charAt(0) === '$';
		}
	}

	find(selectorOrRef) {
		if (this.isRef(selectorOrRef)) {
			let ref = selectorOrRef.replace('$', '');
			return this.wrapper.vm.$refs[ref];
		}
		return this.wrapper.find(selectorOrRef);
	}

	type(selector, value) {
		let node = this.wrapper.find(selector);

		node.element.value = value;
		node.trigger('input');
	}

	expectEvent(name, count) {
		expect(this.wrapper.emitted()[name]).toBeTruthy();
		if (count !== undefined) {
			expect(this.wrapper.emitted()[name].length).toEqual(count);
		}
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