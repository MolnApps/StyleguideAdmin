class LogoHelper {
	constructor (ui, wrapper) {
		this.ui = ui;
		this.wrapper = wrapper;
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

	make(title, override)
	{
		let logo = {
			id: '', 
			title: title, 
			url: 'storage/logo.svg'
		};

		Object.assign(logo, this.specs());

		if (override) {
			Object.assign(logo, override);
		}

		return logo;
	}

	merge(object1, object2)
	{
		Object.assign(object1, object2);

		return object1;
	}

	specs()
	{
		return {
			width: '200', 
			height: '200', 
			display_width: '200px', 
			display_height: '200px', 
			space_x: '30%', 
			space_y: '30%', 
			min_width: '30px', 
			min_width_text: '30mm'
		}
	}

	pivot(colour)
	{
		return {
			pivot: {
				preferences: {
					'background-color': colour
				}
			}
		}
	}

	fillSpecForm()
	{
		this.ui.type('input[name="display_width"]', '300px');
		this.ui.type('input[name="display_height"]', '200px');
		this.ui.type('input[name="space_x"]', '50%');
		this.ui.type('input[name="space_y"]', '25%');
		this.ui.type('input[name="min_width"]', '30px');
		this.ui.type('input[name="min_width_text"]', '25mm');
	}

	addLogoFromLibrary()
	{
		this.ui.click('div.all div[data-id="2"]');

		this.ui.seeForm('#logoBgForm');
		this.ui.type('input[name="hex"]', '#0099ff');
		this.ui.click('#save');
	}

	removeLogoFromPage()
	{
		this.ui.click('div.page div[data-id="1"][data-background="#000000"] .del');
	}

	clickEditLogo()
	{
		this.ui.click('div.all div[data-id="2"] .edit');
	}

	clickEditLogoBg()
	{
		this.ui.click('div.page div[data-id="1"][data-background="#000000"] .edit');
	}

	seePageLogo(id, hex)
	{
		this.ui.seeElement('div.page div[data-id="' + id + '"][data-background="' + hex + '"]');
	}

	notSeePageLogo(id, hex)
	{
		this.ui.notSeeElement('div.page div[data-id="' + id + '"][data-background="' + hex + '"]');
	}
}

export default LogoHelper;