import Endpoint from '@/Endpoint.js'

describe('Endpoint.js', () => {
	it ('returns a url if no record is passed', () => {
        let endpoint = new Endpoint;
    	let url = endpoint.getUrl('/person');
    	expect(url).toEqual('/person');
    })

	it ('returns a url if new record is passed', () => {
        let endpoint = new Endpoint;
    	let url = endpoint.getUrl('/person', {});
    	expect(url).toEqual('/person');
    })

    it ('returns a url if existing record is passed', () => {
        let endpoint = new Endpoint;
    	let url = endpoint.getUrl('/person', {id: 15});
    	expect(url).toEqual('/person/15');
    })

    it ('returns no headers by default', () => {
        let endpoint = new Endpoint;
        let headers = endpoint.getHeaders();
        expect(headers).toEqual({});
    })

    it ('appends authorization headers', () => {
        let endpoint = new Endpoint;
        endpoint.addHeader('authorization');
        let headers = endpoint.getHeaders();
        expect(headers).toEqual({'Authorization': 'Bearer '});
    })

    it ('appends multipart form data headers', () => {
        let endpoint = new Endpoint;
        endpoint.addHeader('multipartFormData');
        let headers = endpoint.getHeaders();
        expect(headers).toEqual({'Content-Type': 'multipart/form-data'});
    })
})