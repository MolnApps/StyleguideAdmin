class FormDataCollector
{
	constructor(originalData, data, uploads)
	{
		this.originalData = originalData;
		this.data = data;
		this.uploads = uploads;
	}

	collect()
	{
		let formData = new FormData();

		for (let attribute in this.originalData) {
			this.dataFormRecursive(formData, attribute, this.data);
		}

		for (let attribute in this.uploads) {
			formData.append(attribute, this.uploads[attribute], this.uploads[attribute].name);
		}
		
		return formData;
	}

	dataFormRecursive(formData, attribute, data)
	{
		if (Array.isArray(data[attribute])) {
			return data[attribute].map((el, i) => {
				this.dataFormRecursive(formData, attribute + '[' + i + ']', el);
			});
		}

		if (typeof data[attribute] === 'object' && data[attribute] !== null) {
			return data[attribute].map((el, key) => {
				this.dataFormRecursive(formData, attribute + '[' + key + ']', el);
			});
		}

		formData.append(attribute, data[attribute]);
	}
}

export default FormDataCollector;