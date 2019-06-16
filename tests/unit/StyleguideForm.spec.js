import StyleguideForm from '@/StyleguideForm.js'
import {AjaxHelper} from './../helpers/Helpers.js'

describe('StyleguideForm.js', () => {
    let ajaxHelper;
    let record;
    let form;

    beforeEach(() => {
        ajaxHelper = new AjaxHelper();
        ajaxHelper.install();

        record = {id: 15, title: 'Foo', body: 'Bar'};
        form = new StyleguideForm(record);
    })

    afterEach(() => {
        ajaxHelper.uninstall();
    })

	it ('stores the passed object properties as its own properties', () => {
        let form = new StyleguideForm({id: 15, title: 'Foo', body: 'Bar'});

        expect(form.id).toBe(15);
        expect(form.title).toBe('Foo');
        expect(form.body).toBe('Bar');
    })

    it ('allows to constrain the properties to be transferred', () => {
        let form = new StyleguideForm({id: 15, title: 'Foo', body: 'Bar'}, ['title']);

        expect(form.id).toBe(15);
        expect(form.title).toBe('Foo');
        expect(form.body).toBe(undefined);
    })

    it ('caches the original data', () => {
        form.id = 18;
        form.title = 'Foobar';
        form.body = 'Barbaz';

        expect(form.id).toBe(18);
        expect(form.title).toBe('Foobar');
        expect(form.body).toBe('Barbaz');

        expect(form.originalData.id).toBe(15);
        expect(form.originalData.title).toBe('Foo');
        expect(form.originalData.body).toBe('Bar');
    })

    it ('deep clones the original data', () => {
        let form = new StyleguideForm({
            weights: [
                {title: 'Bold', weight: 700}, 
                {title: 'Regular', weight: 500}, 
                {title: 'Light', weight: 300}
            ]
        });

        form.weights[0].title = 'Heavy';
        
        expect(form.weights[0].title).toBe('Heavy');
        
        expect(form.originalData.weights[0].title).toBe('Bold');
    })

    it ('submits an ajax call', (done) => {
        mockSuccessfulRequest();

        form.submit('/pages', record);

        ajaxHelper.expectAfterRequest(() => {
            ajaxHelper.expectRequest('/pages/15', record);
        }, done);
    })

    it ('submits an ajax call using the id of the instance', (done) => {
        mockSuccessfulRequest();

        form.submit('/pages');

        ajaxHelper.expectAfterRequest(() => {
            ajaxHelper.expectRequest('/pages/15', record);
        }, done);
    })

    it ('submits an ajax call using the id of the instance even with constraints', (done) => {
        mockSuccessfulRequest();

        form = new StyleguideForm(record, ['title']);

        form.submit('/pages');

        ajaxHelper.expectAfterRequest(() => {
            ajaxHelper.expectRequest('/pages/15', {title: 'Foo'});
        }, done);
    })

    it ('stores feedback as a property after ajax call', (done) => {
        mockSuccessfulRequest();

        form.submit('/pages', record);

        ajaxHelper.expectAfterRequest(() => {
            expect(form.feedback).toEqual(['The page was updated.']);
        }, done);
    })

    it ('emits an event after ajax call', (done) => {
        mockSuccessfulRequest();

        form.on('success', (data) => {
            expect(data).toEqual({
                feedback: ['The page was updated.'],
                record: {id: 18, title: 'Foobar', body: 'Barbaz'}
            });
            done();
        })

        form.submit('/pages', record);
    })

    it ('stores feedback as a property after ajax call with errors', (done) => {
        mockRequestWithErrors();

        form.submit('/pages', record);

        ajaxHelper.expectAfterRequest(() => {
            expect(form.feedback).toEqual(['An error occourred']);
        }, done);
    })

    it ('stores validation errors as a property after ajax call with errors', (done) => {
        mockRequestWithValidationErrors();

        form.submit('/pages', record);

        ajaxHelper.expectAfterRequest(() => {
            expect(form.errors).toEqual({title: ['Please provide a title']});
        }, done);
    })

    it ('emits an event after failed ajax call', (done) => {
        mockRequestWithErrors();

        form.on('fail', (data) => {
            done();
        })

        form.submit('/pages', record);
    })

    it ('allows to reset the props with the record returned by ajax request', (done) => {
        form.shouldReset(true);

        mockSuccessfulRequest();

        form.submit('/pages', record);

        ajaxHelper.expectAfterRequest(() => {
            expect(form.id).toBe(18);
            expect(form.title).toBe('Foobar');
            expect(form.body).toBe('Barbaz');
        }, done);
    })

    it ('caches original data again after an ajax request', (done) => {
        form.shouldReset(true);

        mockSuccessfulRequest();

        expect(form.originalData.id).toBe(15);
        expect(form.originalData.title).toBe('Foo');
        expect(form.originalData.body).toBe('Bar');

        form.submit('/pages', record);

        ajaxHelper.expectAfterRequest(() => {
            expect(form.originalData.id).toBe(18);
            expect(form.originalData.title).toBe('Foobar');
            expect(form.originalData.body).toBe('Barbaz');
        }, done);
    })

    it ('resets the errors if a second request is successful', (done) => {
        mockRequestWithValidationErrors();
        
        form.submit('/pages', record);

        ajaxHelper.expectAfterRequest(
            () => {
                expect(form.errors).not.toEqual({});
            }, 
            () => {
                ajaxHelper.stubRequest(/foobar/, ajaxHelper.getSuccessfulResponse());

                form.submit('/foobar', record);

                ajaxHelper.expectAfterRequest(() => {
                    expect(form.errors).toEqual({});
                }, done);
            }
        );
    })

    it ('provides a method to reset the form to its original data', () => {
        expect(form.id).toBe(15);
        expect(form.title).toBe('Foo');
        expect(form.body).toBe('Bar');

        form.id = 18;
        form.title = 'Foobar';
        form.body = 'Barbaz';

        expect(form.id).toBe(18);
        expect(form.title).toBe('Foobar');
        expect(form.body).toBe('Barbaz');

        form.reset();

        expect(form.id).toBe(15);
        expect(form.title).toBe('Foo');
        expect(form.body).toBe('Bar');
    })

    it ('will add properties to an object if they are not set', () => {
        let form = new StyleguideForm({contacts: []}, ['contacts', 'title']);

        expect(form.contacts).toEqual([]);
        expect(form.title).toBe('');
    })

    let mockSuccessfulRequest = () => {
        let newRecord = {id: 18, title: 'Foobar', body: 'Barbaz'};
        ajaxHelper.stubRequest(/pages/, ajaxHelper.getSuccessfulResponse(newRecord));
    }

    let mockRequestWithErrors = () => {
        ajaxHelper.stubRequest(/pages/, ajaxHelper.getResponseWithErrors('An error occourred'));
    }

    let mockRequestWithValidationErrors = () => {
        ajaxHelper.stubRequest(/pages/, ajaxHelper.getResponseWithValidationErrors({
            title: ['Please provide a title']
        }));
    }
})