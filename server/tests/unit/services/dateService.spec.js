(function (describe, beforeEach, inject, it) {
    'use strict';
    describe('dateService', function () {

        var dateService;

        beforeEach(module("components"));
        beforeEach(inject(["$rootScope", "dateService", function ($rootScope, _dateService) {
            dateService = _dateService;
        }]));

        describe('getFormattedDate', function () {
            it('[should return a formatted date', function () {
                expect(dateService.getFormattedDate('1-1-90')).toBe('01-01-1990');
                expect(dateService.getFormattedDate('01-1-90')).toBe('01-01-1990');
                expect(dateService.getFormattedDate('1-01-90')).toBe('01-01-1990');
                expect(dateService.getFormattedDate('1-1-1990')).toBe('01-01-1990');
                expect(dateService.getFormattedDate('01-11-90')).toBe('11-01-1990');
                expect(dateService.getFormattedDate('01-30-90')).toBe('30-01-1990');
                expect(dateService.getFormattedDate('01-36-90')).toBe('aN-aN-NaN');
            });
        });
    });
})(window.describe, window.beforeEach, window.inject, window.it);