import Endpoint from '@/Endpoint.js'

describe('Endpoint.js', () => {
	it ('returns a url if no record is passed', () => {
    	let url = Endpoint.url('/person');
    	expect(url).toEqual('/person');
    })

	it ('returns a url if new record is passed', () => {
    	let url = Endpoint.url('/person', {});
    	expect(url).toEqual('/person');
    })

    it ('returns a url if existing record is passed', () => {
    	let url = Endpoint.url('/person', {id: 15});
    	expect(url).toEqual('/person/15');
    })
})