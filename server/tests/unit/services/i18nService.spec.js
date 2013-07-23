describe('i18nService', function () {
    'use strict';
    var i18nService;

    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "$httpBackend", "i18nService",
    function ($rootScope, $httpBackend, i18nService_) {
        i18nService = i18nService_;
        loadLanguages($httpBackend, i18nService);
    }]));

    describe('getLanguages', function() {
        it('should retrieve languages with the proper structure', function() {
            var languages = i18nService.getLanguages();
            expect(languages[0]).not.toBe(undefined);
            expect(languages[0].code).not.toBe(undefined);
            expect(languages[0].text).not.toBe(undefined);
        });
    });

    describe('language detection', function() {
        it('should detect the default and current language as english', function() {
            var currentLanguage = i18nService.getCurrentLanguage(),
                defaultLanguage = i18nService.getDefaultLanguage(),
                englishLangCode = 'en';
            expect(defaultLanguage).toBe(englishLangCode);
            expect(currentLanguage).toBe(englishLangCode);
        });
        it('should detect the language change', function() {
            var currentLanguage, spanishLangCode = 'es';
            i18nService.changeLanguage(spanishLangCode);
            currentLanguage = i18nService.getCurrentLanguage();
            expect(currentLanguage).toBe(spanishLangCode);
        });
    });
});