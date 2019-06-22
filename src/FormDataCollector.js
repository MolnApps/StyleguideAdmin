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

	toObject(formData)
	{
		if ( ! formData) {
			formData = this.collect();
		}

		let object = {};

		for (let pair of formData) {
			object[pair[0]] = pair[1];
		}

		return object;
	}

	dataFormRecursive(formData, attribute, data)
	{
		if (Array.isArray(data[attribute])) {
			return data[attribute].map((el, i) => {
				this.handleArrayOrObject(formData, attribute, el, i);
			});
		}

		if (typeof data[attribute] === 'object' && data[attribute] !== null) {
			for (let [i, el] of Object.entries(data[attribute])) {
				this.handleArrayOrObject(formData, attribute, el, i);
			}
			return;
		}
		
		formData.append(attribute, data[attribute]);
	}

	handleArrayOrObject(formData, attribute, el, i)
	{
		let tmp = {};
		let arrAttribute = attribute + '[' + i + ']';
		tmp[arrAttribute] = el;
		this.dataFormRecursive(formData, arrAttribute, tmp);
	}
}

export default FormDataCollector;