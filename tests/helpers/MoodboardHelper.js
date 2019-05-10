class MoodboardHelper {
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

	getImages()
	{
		return [
			{id: 1, src: 'https://loremflickr.com/549/280/?71087', width: 549, height: 280},
			{id: 2, src: 'https://loremflickr.com/247/424/?62311', width: 247, height: 424},
			{id: 3, src: 'https://loremflickr.com/227/251/?44689', width: 227, height: 251},
		];
	}
}

export default MoodboardHelper;