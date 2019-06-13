import axios from 'axios'
import EventEmitter from 'events'
//import FormDataCollector from './FormDataCollector'
import Endpoint from './Endpoint';

class StyleguideForm extends EventEmitter
{
	constructor(data, constraints)
	{
		super();

		this.constraints = constraints;

		this.id = null;

		this.bootstrap(data);
		
		this.feedback = [];
		this.errors = {};

		this.uploads = {};

		this.preferences = {
			shouldReset: false
		};
	}

	bootstrap(data)
	{
		this.id = data.id;
		data = this.constrainData(data);
		
		this.cacheOriginalData(data);
		this.transferDataToProperties(data);
	}

	shouldReset(shouldReset)
	{
		this.preferences.shouldReset = true;
	}

	constrainData(data)
	{
		if ( ! this.constraints) {
			return data;
		}

		let result = {}
			
		this.constraints.forEach((key) => {
			result[key] = data[key];
		})
		
		return result;
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

	filesChange(fieldName, fileList)
	{
		this.uploads[fieldName] = fileList[0];
	}

	reset()
	{
		this.bootstrap(this.originalData);
	}

	submit(endpoint, record)
	{
		if ( ! record) {
			record = {id: this.id};
		}

		return axios
			.post(
				Endpoint.url(endpoint, record), 
				this.data(),
				{
					headers: Endpoint.headers()
				}
			)
            .then(({data}) => {
            	this.feedback = data.feedback;
                this.errors = {};
                
                if (this.preferences.shouldReset) {
                	this.bootstrap(data.record);
                }

                this.emit('success', data);
            })
            .catch((error) => {
            	if (error.response) {
            		this.feedback = error.response.data.feedback;
            		this.errors = error.response.data.errors;
            	} else {
            		this.feedback = ['Unknown error'];
            		this.errors = {};
            	}
            	
            	this.emit('fail');
            });
	}
}

export default StyleguideForm;