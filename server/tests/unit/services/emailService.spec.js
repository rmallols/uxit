'use strict';
describe('emailService', function () {

    var emailService;

    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "emailService", function ($rootScope, _emailService) {
        emailService = _emailService;
    }]));

    describe('validateEmail', function () {
        it('should validate email formats', function () {
            expect(emailService.validateEmail('john')).toBe(false);
            expect(emailService.validateEmail('john@')).toBe(false);
            expect(emailService.validateEmail('john@doe')).toBe(false);
            expect(emailService.validateEmail('john@doe.')).toBe(false);
            expect(emailService.validateEmail('john@doe.c')).toBe(true);
            expect(emailService.validateEmail('john.surname@doe.c')).toBe(true);
            expect(emailService.validateEmail('john.surname@doe.bla.c')).toBe(true);
        });
    });
});
