describe('dbService', function () {
    'use strict';
    var dbService, selectorToken = 'abc';

    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "dbService", function ($rootScope, dbService_) {
        dbService = dbService_;
    }]));

    describe('getInsensitiveSelector', function() {
        it('should generate an insensitive selector based on a regular expression', function() {
            var insensitiveSelector = dbService.getInsensitiveSelector(selectorToken);
            expect(insensitiveSelector.$regex).toBe(selectorToken);
            expect(insensitiveSelector.$options).toBe('i');
        });
    });

    describe('getInexactSelector', function() {
        it('should generate an inexact selector based on a regular expression', function() {
            var inexactSelector = dbService.getInexactSelector(selectorToken);
            expect(inexactSelector.$regex).toBe('^.*' + selectorToken + '.*');
            expect(inexactSelector.$options).toBe('i');
        });
    });
});