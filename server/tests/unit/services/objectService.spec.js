describe('objectService', function() {
    'use strict';
    var objectService;

    beforeEach( module("components"));
    beforeEach(inject(["objectService", function (objectService_) {
        objectService = objectService_;
    }]));

    describe('isObject', function() {

        it('should detect valid objects as objects', function() {
            expect(objectService.isObject({})).toBe(true);
            expect(objectService.isObject({ a: 'a'})).toBe(true);
            expect(objectService.isObject({ b: {}})).toBe(true);
            expect(objectService.isObject({ c: { d: 'd'}})).toBe(true);
            expect(objectService.isObject({ e: []})).toBe(true);
            expect(objectService.isObject({ f: ['g', 'h']})).toBe(true);
            expect(objectService.isObject(['var'])).toBe(true);
        });

        it('should detect invalid objects as non objects', function() {
            expect(objectService.isObject('')).toBe(false);
            expect(objectService.isObject('foo')).toBe(false);
            expect(objectService.isObject(function() {})).toBe(false);
        });
    });

    describe('isEmpty', function() {

        it('should identify an empty string (\'\')', function() {
            var isEmptyToken = objectService.isEmpty('');
            expect(isEmptyToken).toBe(true);
        });

        it('should identify an empty string (null)', function() {
            var isEmptyToken = objectService.isEmpty(null);
            expect(isEmptyToken).toBe(true);
        });

        it('should identify an empty string (undefined)', function() {
            var isEmptyToken = objectService.isEmpty(undefined);
            expect(isEmptyToken).toBe(true);
        });

        it('should identify an empty string (non empty)', function() {
            var isEmptyToken = objectService.isEmpty(' ');
            expect(isEmptyToken).toBe(false);
        });
    });

    describe('getRootKeys', function() {

        var keysObj;
        beforeEach(function() {
            keysObj = objectService.getRootKeys({ a: 'c', b: { b1: 'd'}, c: undefined})
        });

        it('should get the proper amount of root level keys of a given object', function() {
            expect(keysObj.length).toBe(3);
        });

        it('should get the root level keys of a given object', function() {
            expect(keysObj[0]).toBe('a');
            expect(keysObj[1]).toBe('b');
            expect(keysObj[2]).toBe('c');
        });
    });
});