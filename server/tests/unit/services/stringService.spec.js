describe('stringService', function() {
    'use strict';
    var stringService;

    beforeEach( module("components"));
    beforeEach(inject(["$rootScope", "stringService", function ($rootScope, stringService_) {
            stringService = stringService_;
    }]));

    describe('replaceToken', function() {
        it('should replace the first token char', function() {
            var targetToken = stringService.replaceToken('abc', 'a', 'd');
            expect(targetToken).toBe('dbc');
        });
        it('should replace the last token char', function() {
            var targetToken = stringService.replaceToken('abc', 'c', 'd');
            expect(targetToken).toBe('abd');
        });
        it('should replace an internal token char', function() {
            var targetToken = stringService.replaceToken('abc', 'b', 'd');
            expect(targetToken).toBe('adc');
        });
        it('should replace multiple token chars', function() {
            var targetToken = stringService.replaceToken('abc', 'bc', 'd');
            expect(targetToken).toBe('ad');
        });
    });

    describe('capitalize', function() {
        it('should capitalize the given string', function() {
            var capitalizedToken = stringService.capitalize('abc');
            expect(capitalizedToken).toBe('Abc');
        });
    });

    describe('decapitalize', function() {
        it('should decapitalize the given string', function() {
            var capitalizedToken = stringService.decapitalize('Abc');
            expect(capitalizedToken).toBe('abc');
        });
    });

    describe('toSnakeCase', function() {
        it('should convert to snake case the given string', function() {
            var snakedCaseToken = stringService.toSnakeCase('abcDef');
            expect(snakedCaseToken).toBe('abc-def');
        });
    });

    describe('toCamelCase', function() {
        it('should convert to snake case the given string', function() {
            var cameledCaseToken = stringService.toCamelCase('abc-def');
            expect(cameledCaseToken).toBe('abcDef');
        });
    });

    describe('trim', function() {
        it('should trim the given string', function() {
            var trimmedToken = stringService.trim(' abc def ');
            expect(trimmedToken).toBe('abc def');
        });
    });

    describe('isEmpty', function() {
        it('should idenfity an empty string (\'\')', function() {
            var isEmptyToken = stringService.isEmpty('');
            expect(isEmptyToken).toBe(true);
        });
        it('[should idenfity an empty string (null)', function() {
            var isEmptyToken = stringService.isEmpty(null);
            expect(isEmptyToken).toBe(true);
        });
        it('should idenfity an empty string (undefined)', function() {
            var isEmptyToken = stringService.isEmpty(undefined);
            expect(isEmptyToken).toBe(true);
        });
        it('should idenfity an empty string (non empty)', function() {
            var isEmptyToken = stringService.isEmpty(' ');
            expect(isEmptyToken).toBe(false);
        });
    });
});