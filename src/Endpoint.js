class Endpoint 
{
	constructor()
	{
		this.appendHeaders = [];

		this.headers = {
			multipartFormData: {'Content-Type': 'multipart/form-data'},
			authorization: {'Authorization': 'Bearer ' + this.getApiTokenFromDom()}
		}
	}

	getUrl(endpoint, record)
	{
		if ( ! record || ! record.id) {
			return endpoint;
		}

		return endpoint + '/' + record.id;
	}

	addHeader(header)
	{
		this.appendHeaders.push(header);
	}

	getHeaders()
	{
		let result = {};
		
		for (let i = 0; i < this.appendHeaders.length; i++) {
			Object.assign(
				result, 
				this.headers[this.appendHeaders[i]]
			);
		}
		
		return result;
	}

	getApiTokenFromDom()
	{
		return (document.head.querySelector('[name="api-token"]')) 
			? document.head.querySelector('[name="api-token"]').content
			: '';
	}
}

export default Endpoint;