class IndexHelper {
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

	makeStructure()
	{
		return [
			this.make(1, 'My chapter', 'chapter', {children: [
				this.make(2, 'About us', 'text', {parent: {id: 1}}),
				this.make(3, 'Mission', 'text', {parent: {id: 1}})
			]}),
			this.make(4, 'Another chapter', 'chapter', {children: [
				this.make(5, 'Foobar', 'text', {parent: {id: 4}})
			]})
		];
	}

	make(id, title, type, override)
	{
		return Object.assign({
			id: id,
			position: id - 1,
			page: {id: id, title: title, body: '', type: type, component: '', visible: true},
			parent: {id: null},
			children: []
		}, override);
	}
}

export default IndexHelper;