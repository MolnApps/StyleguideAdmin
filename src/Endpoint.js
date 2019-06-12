let Endpoint = {
	url: function(endpoint, record)
	{
		if ( ! record || ! record.id) {
			return endpoint;
		}

		return endpoint + '/' + record.id;
	},

	headers: function()
	{
		let apiToken = (document.head.querySelector('[name="api-token"]')) 
			? document.head.querySelector('[name="api-token"]').content
			: ''

		return {
			'Authorization': 'Bearer ' + apiToken,
		};
	}
}

export default Endpoint;