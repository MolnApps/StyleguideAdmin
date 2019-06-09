import moxios from 'moxios'
import expect from 'expect'
import StyleguideForm from '../../src/StyleguideForm'

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

		let paramsData = new StyleguideForm(params).data();
		
		expect(JSON.parse(request.config.data)).toEqual(paramsData);
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