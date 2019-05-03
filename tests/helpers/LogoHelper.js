class LogoHelper {
	constructor (ui, wrapper) {
		this.ui = ui;
		this.wrapper = wrapper;
	}

	make(title, override)
	{
		let logo = {
			id: '', 
			title: 'Primary logo', 
			url: 'storage/logo.svg'
		};

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
			width: 200, 
			height: 200, 
			display_width: 200, 
			display_height: 200, 
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
}

export default LogoHelper;