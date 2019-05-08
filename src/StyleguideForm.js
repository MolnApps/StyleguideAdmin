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
		let data = {};

		for (let attribute in this.originalData) {
			data[attribute] = this[attribute];
		}

		return data;
	}

	submit(endpoint)
	{
		return axios.post(endpoint, this.data())
            .then(({data}) => {
            	this.feedback = data.feedback;
                this.emit('success', data);
            })
            .catch((error) => {
            	this.feedback = error.response.data.feedback;
            	this.errors = error.response.data.errors;
            	this.emit('fail');
            });
	}
}

export default StyleguideForm;