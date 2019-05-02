import axios from 'axios';
import EventEmitter from 'events';

class StyleguideForm extends EventEmitter
{
	constructor(data)
	{
		super();
		this.originalData = JSON.parse(JSON.stringify(data));
		Object.assign(this, data);
		this.feedback = [];
		this.errors = {};
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
            	this.errors = error.response.data.errors;
            	this.emit('fail');
            });
	}
}

export default StyleguideForm;