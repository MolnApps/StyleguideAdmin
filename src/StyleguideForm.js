import axios from 'axios';
import EventEmitter from 'events';

class StyleguideForm extends EventEmitter
{
	constructor(data, constraints)
	{
		super();

		data = this.filterData(data, constraints);
		
		this.cacheOriginalData(data);
		this.transferDataToProperties(data);
		
		this.feedback = [];
		this.errors = {};

		this.uploads = {};
	}

	filterData(data, constraints)
	{
		if (constraints) {
			let tmp = {}
			
			constraints.forEach((key) => {
				tmp[key] = data[key];
			})
			
			data = tmp;
		}

		return data;
	}

	cacheOriginalData(data)
	{
		this.originalData = this.deepCloneData(data);
	}

	deepCloneData(data)
	{
		return JSON.parse(JSON.stringify(data));
	}

	transferDataToProperties(data)
	{
		Object.assign(this, data);
	}

	data()
	{
		return this.dataPlain();
		return this.dataForm();
	}

	dataPlain()
	{
		let data = {};

		for (let attribute in this.originalData) {
			data[attribute] = this[attribute];
		}

		for (let attribute in this.uploads) {
			data[attribute] = this.uploads[attribute];
		}
		
		return data;
	}

	dataForm()
	{
		let formData = new FormData();

		for (let attribute in this.originalData) {
			this.dataFormRecursive(formData, attribute, this);
		}

		for (let attribute in this.uploads) {
			formData.append(attribute, this.uploads[attribute], this.uploads[attribute].name);
		}
		
		return formData;
	}

	dataFormRecursive(formData, attribute, data)
	{
		if (Array.isArray(this[attribute])) {
			return this[attribute].map((el, i) => {
				this.dataFormRecursive(formData, attribute + '[' + i + ']', el);
			});
		} 

		formData.append(attribute, this[attribute]);
	}

	filesChange(fieldName, fileList)
	{
		this.uploads[fieldName] = fileList[0];
	}

	submit(endpoint)
	{
		let apiToken = (document.head.querySelector('[name="api-token"]')) 
			? document.head.querySelector('[name="api-token"]').content
			: '';

		return axios
			.post(
				endpoint, 
				this.data(),
				{
					headers: {
						'Authorization': 'Bearer ' + apiToken,
					}
				}
			)
            .then(({data}) => {
            	this.feedback = data.feedback;
                this.emit('success', data);
            })
            .catch((error) => {
            	if (error.response) {
            		this.feedback = error.response.data.feedback;
            		this.errors = error.response.data.errors;
            	} else {
            		this.feedback = 'Unknown error';
            		this.errors = [];
            	}
            	
            	this.emit('fail');
            });
	}
}

export default StyleguideForm;