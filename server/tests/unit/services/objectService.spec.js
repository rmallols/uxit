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
});