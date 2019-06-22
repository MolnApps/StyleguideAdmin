import moxios from 'moxios'
import expect from 'expect'
import FormDataCollector from '../../src/FormDataCollector'

class AjaxHelper {
	constructor () {
		
	}

	install() {
		moxios.install();
	}

	uninstall() {
		moxios.uninstall();
	}

	stubRequest(endpoint, response) {
		moxios.stubRequest(endpoint, response);
	}

	getSuccessfulResponse(record, override) {
		if (record) {
			record = JSON.parse(JSON.stringify(record));
			Object.assign(record, override);
		}

		return {
			status: 200,
			responseText: {
				feedback: ['The page was updated.'],
				record: record
			}
		}
	}

	getResponseWithValidationErrors(errors) {
		return {
			status: 403,
			responseText: {
				errors: errors
			}
		}
	}

	getResponseWithErrors(feedback) {
		return {
			status: 403,
			responseText: {
				feedback: [feedback]
			}
		}
	}

	expectRequest(url, params) {
		let request = moxios.requests.mostRecent();
		expect(request.config.url).toEqual(url);

		let formDataCollector = new FormDataCollector(params, params);
		
		expect(
			formDataCollector.toObject(request.config.data)
		).toEqual(formDataCollector.toObject());
	}

	expectHeaders(expectedHeaders) {
		let request = moxios.requests.mostRecent();
		for (let [key, value] of Object.entries(expectedHeaders)) {
			expect(request.config.headers[key]).toEqual(value);
		}
	}

	notExpectHeaders(expectedHeaders) {
		let request = moxios.requests.mostRecent();
		for (let i = 0; i < expectedHeaders.length; i++) {
			expect(Object.keys(request.config.headers)).not.toContain(expectedHeaders[i]);
		}
	}

	expectAfterRequest(callback, done) {
		moxios.wait(() => {
			callback();
			done();
		});
	}

	expectNoRequests() {
		expect(moxios.requests.mostRecent()).toBeFalsy();
	}
}

export default AjaxHelper;