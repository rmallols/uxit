describe('i18nService', function () {
    'use strict';
    var i18nService, $httpBackend;

    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "$httpBackend", "i18nService",
    function ($rootScope, $httpBackend_, i18nService_) {
        i18nService     = i18nService_;
        $httpBackend    = $httpBackend_;
        loadLanguages($httpBackend, i18nService);
    }]));

    describe('getLanguages', function() {

        it('should retrieve the proper amount of languages', function() {
            var languages = i18nService.getLanguages(true);
            expect(languages.length).toBe(3);
        });

        it('should retrieve the proper amount of active languages', function() {
            var languages = i18nService.getLanguages(false);
            expect(languages.length).toBe(2);
        });

        it('should retrieve languages with the proper structure', function() {
            var languages = i18nService.getLanguages();
            expect(languages[0]).not.toBe(undefined);
            expect(languages[0].code).not.toBe(undefined);
            expect(languages[0].text).not.toBe(undefined);
            expect(languages[0].position).not.toBe(undefined);
        });
    });

    describe('getDefaultLanguage', function() {

        it('should retrieve the proper default language', function() {
            var defaultLanguage = i18nService.getDefaultLanguage(),
                languages = i18nService.getLanguages(false);
            expect(defaultLanguage).toBe(languages[0].code);
        });
    });

    describe('language detection', function() {

        it('should detect language change', function() {
            var currentLanguage, spanishLangCode = 'es';
            i18nService.changeLanguage(spanishLangCode);
            currentLanguage = i18nService.getCurrentLanguage();
            expect(currentLanguage).toBe(spanishLangCode);
        });

        it('should change the current language if it\'s set as inactive', function() {
            var currentLanguage, spanishLangCode = 'es',
                languages = i18nService.getLanguages();
            i18nService.changeLanguage(spanishLangCode);
            currentLanguage = i18nService.getCurrentLanguage();
            expect(currentLanguage).toBe(spanishLangCode);
            angular.forEach(languages, function(language) {
                if(language.code === spanishLangCode) {
                    language.inactive = true;
                }
            });
            loadLanguages($httpBackend, i18nService, function() {
                currentLanguage = i18nService.getCurrentLanguage();
                expect(currentLanguage).not.toBe(spanishLangCode);
            });
        });
    });
});