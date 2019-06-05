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
				this.make(2, 'About us', 'text', {parent_id: 1}),
				this.make(3, 'Mission', 'text', {parent_id: 1})
			]}),
			this.make(4, 'Another chapter', 'chapter', {children: [
				this.make(5, 'Foobar', 'text', {parent_id: 4})
			]})
		];
	}

	make(id, title, type, override)
	{
		return Object.assign({
			id: id,
			parent_id: null,
			position: id - 1,
			page: {id: id, title: title, body: '', type: type, component: '', visible: true},
			parent: null,
			children: []
		}, override);
	}
}

export default IndexHelper;