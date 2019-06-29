import axios from 'axios'
import EventEmitter from 'events'
import FormDataCollector from './FormDataCollector'
import Endpoint from './Endpoint';
import bus from './bus';

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
			shouldReset: false,
			hasUploads: false
		};
	}

	bootstrap(data)
	{
		if (data.id) {
			this.id = data.id;
		}

		data = this.constrainData(data);
		
		this.cacheOriginalData(data);
		this.transferDataToProperties(data);
	}

	shouldReset(shouldReset)
	{
		this.preferences.shouldReset = true;
	}

	hasUploads(hasUploads)
	{
		this.preferences.hasUploads = true;
	}

	constrainData(data)
	{
		if ( ! this.constraints) {
			return data;
		}

		let result = {}
			
		this.constraints.forEach((key) => {
			result[key] = data[key] !== undefined ? data[key] : '';
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
		return new FormDataCollector(this.originalData, this, this.uploads).collect();
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

		let endpointHelper = new Endpoint();

		endpointHelper.addHeader('authorization');
		if (this.preferences.hasUploads) {
			endpointHelper.addHeader('multipartFormData');
		}

		return axios
			.post(
				endpointHelper.getUrl(endpoint, record), 
				this.data(),
				{
					headers: endpointHelper.getHeaders()
				}
			)
            .then(({data}) => {
            	this.feedback = data.feedback;
                this.errors = {};
                
                if (this.preferences.shouldReset) {
                	this.bootstrap(data.record);
                }

                this.emit('success', data);
                bus.$emit('done');
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
            	bus.$emit('done');
            });
	}
}

export default StyleguideForm;