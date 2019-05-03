import moxios from 'moxios'

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

	expectRequest(url, params) {
		let request = moxios.requests.mostRecent();
		expect(request.config.url).toEqual(url);
		expect(JSON.parse(request.config.data)).toEqual(params);
	}

	expectAfterRequest(callback, done) {
		moxios.wait(() => {
			callback();
			done();
		});
	}
}

export default AjaxHelper;