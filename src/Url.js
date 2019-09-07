class Url 
{
	constructor()
	{
		this.baseUrl = 'http://styleguide-api.test/api/v1/1';
	}

	append(path)
	{
		return this.baseUrl + path;
	}
}

export default Url;