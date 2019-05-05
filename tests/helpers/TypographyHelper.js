class TypographyHelper {
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

	makeWithPivot(id, name, weights, pivotWeight)
	{
		let typefaceFamily = this.make(id, name, weights);

		Object.assign(typefaceFamily, {pivot: {preferences: {weight: pivotWeight}}});

		return typefaceFamily;
	}

	make(id, name, weights)
	{
		let weightsNumber = weights;

		let weightsMap = [
			{name: name + ' bold', weight: '700'},
			{name: name + ' regular', weight: '400'},
			{name: name + ' light', weight: '300'}
		]
		
		weights = weights.map((weight) => {
			return weightsMap.filter((w) => {
				return w.weight == weight;
			})[0];
		});

		return {
			id: id, 
			title: name, 
			weights: weights, 
			webfont_url: 'https://fonts.googleapis.com/css?family=' + name + ':' + weightsNumber.join(','), 
			foundry_url: 'https://fonts.google.com/specimen/' + name
		};
	}
}

export default TypographyHelper;