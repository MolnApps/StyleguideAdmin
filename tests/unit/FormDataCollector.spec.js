import FormDataCollector from '@/FormDataCollector.js'
import {AjaxHelper} from './../helpers/Helpers.js'

describe('FormDataCollector.js', () => {
    let data;
    let uploads;
    let collector;

    it ('returns a formdata object', () => {
        collector = new FormDataCollector({}, {}, {});

        let result = collector.collect();
        expect(result).toBeInstanceOf(FormData);
    })

    it ('stores the passed object properties', () => {
        data = {id: 15, title: 'Foo', body: 'Bar'};
        uploads = {};
        collector = new FormDataCollector(data, data, uploads);

        let result = collector.collect().entries();
        expect(result.next().value).toEqual(['id', '15']);
        expect(result.next().value).toEqual(['title', 'Foo']);
        expect(result.next().value).toEqual(['body', 'Bar']);
        expect(result.next().value).toBe(undefined);
    })

    it ('stores the passed object properties array', () => {
        data = {id: 15, title: 'Foo', body: ['Bar', 'Baz']};
        uploads = {};
        collector = new FormDataCollector(data, data, uploads);

        let result = collector.collect().entries();
        expect(result.next().value).toEqual(['id', '15']);
        expect(result.next().value).toEqual(['title', 'Foo']);
        expect(result.next().value).toEqual(['body[0]', 'Bar']);
        expect(result.next().value).toEqual(['body[1]', 'Baz']);
        expect(result.next().value).toBe(undefined);
    })

    it ('stores the passed object properties object', () => {
        data = {id: 15, title: 'Foo', body: {foo: 'Bar', bar: 'Baz'}};
        uploads = {};
        collector = new FormDataCollector(data, data, uploads);

        let result = collector.collect().entries();
        expect(result.next().value).toEqual(['id', '15']);
        expect(result.next().value).toEqual(['title', 'Foo']);
        expect(result.next().value).toEqual(['body[foo]', 'Bar']);
        expect(result.next().value).toEqual(['body[bar]', 'Baz']);
        expect(result.next().value).toBe(undefined);
    })

    it ('stores the passed object properties recursively', () => {
        data = {id: 15, title: 'Foo', body: {foo: ['Bar', 'Baz'], bar: 'Foobar'}};
        uploads = {};
        collector = new FormDataCollector(data, data, uploads);

        let result = collector.collect().entries();
        expect(result.next().value).toEqual(['id', '15']);
        expect(result.next().value).toEqual(['title', 'Foo']);
        expect(result.next().value).toEqual(['body[foo][0]', 'Bar']);
        expect(result.next().value).toEqual(['body[foo][1]', 'Baz']);
        expect(result.next().value).toEqual(['body[bar]', 'Foobar']);
        expect(result.next().value).toBe(undefined);
    })

    it ('stores the passed uploads properties', () => {
        data = {};
        uploads = {file: new Blob()};
        collector = new FormDataCollector(data, data, uploads);

        let result = collector.collect().entries();
        expect(result.next().value[1]).toBeInstanceOf(File);
    })

    it ('returns an object for a formdata object', () => {
        collector = new FormDataCollector();
        
        let formData = new FormData();
        formData.append('foo', 'bar');
        formData.append('bar', 'baz');
        
        expect(collector.toObject(formData)).toEqual({foo: 'bar', bar: 'baz'});
    })
})