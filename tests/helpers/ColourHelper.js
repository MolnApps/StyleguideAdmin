class ColourHelper {
	constructor () {
		
	}

	setTestHelper(ui)
	{
		this.ui = ui;

		return this;
	}

	setWrapper(wrapper)
	{
		this.wrapper = wrapper;

		return this;
	}

	make (title, hex, id) {
		return Object.assign({
			title: title, 
			hex: hex,
			rgb: '',
			cmyk: '',
			pantone: ''
		}, id ? {id: id} : null);
	}

	add (colour) {
		if (! colour) {
			colour = this.make('Cyan', '#00ffff');
		}
		
		this.ui.click('$add');
		this.fillForm(colour);
		this.ui.click('#save');
	}

	remove (id) {
		id = id ? id : 1;
		this.ui.click('div.page div[data-id="' + id + '"] .del');
	}

	fillForm (colour) {
		this.ui.type('input[name="title"]', colour.title);
		this.ui.type('input[name="hex"]', colour.hex);
	}

	expect (title, id) {
		this.ui.see(title, 'div.page');
		expect(this.wrapper.find('div.page div[data-id="' + id + '"]').exists()).toBe(true);
	}
}

export default ColourHelper;