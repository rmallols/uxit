describe('i18nDbService', function () {
    'use strict';
    var i18nService, i18nDbService;

    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "$httpBackend", "i18nService", "i18nDbService",
    function ($rootScope, $httpBackend, i18nService_, i18nDbService_) {
        i18nService     = i18nService_;
        i18nDbService   = i18nDbService_;
    }]));

    describe('getI18nProperty', function() {
        it('should get the corresponding i18n property (no i18n structure)', function() {
            var label = 'hellow i18n',
                i18nProp = i18nDbService.getI18nProperty(label);
            expect(i18nProp.text).toBe(label);
        });
        it('should get the corresponding i18n property (i18n structure present for all languages)', function() {
            var label = { en: { text: 'hellow i18n' }, es: { text: 'hola i18n' }},
                i18nProp;
            i18nService.changeLanguage('es');
            i18nProp = i18nDbService.getI18nProperty(label);
            expect(i18nProp.text).toBe(label.es.text);
        });
        it('should get the corresponding i18n property (i18n structure present just for the default language)', function() {
            var label = { en: { text: 'hellow i18n' }},
                i18nProp;
            i18nService.changeLanguage('es');
            i18nProp = i18nDbService.getI18nProperty(label);
            expect(i18nProp.text).toBe(label.en.text);
        });
    });

    describe('hasI18nStructure', function() {
        it('should detect that an object doesn\'t have i18n structure', function() {
            var label = 'hellow i18n',
                hasI18nStructure = i18nDbService.hasI18nStructure(label);
            expect(hasI18nStructure).toBe(false);
        });
        it('should detect that an object has i18n structure in the default language', function() {
            var label = { en: { text: 'hellow i18n' }},
                hasI18nStructure;
            i18nService.changeLanguage('en');
            hasI18nStructure = i18nDbService.hasI18nStructure(label);
            expect(hasI18nStructure).toBe(true);
        });
        it('should detect that an object doesn\'t have i18n structure in a non default language', function() {
            var label = { en: { text: 'hellow i18n' }},
                hasI18nStructure;
            i18nService.changeLanguage('es');
            hasI18nStructure = i18nDbService.hasI18nStructure(label);
            expect(hasI18nStructure).toBe(false);
        });
        it('should detect that an object has i18n structure in a non default language', function() {
            var label = { en: { text: 'hellow i18n' }, es: { text: 'hola i18n' }},
                hasI18nStructure;
            i18nService.changeLanguage('es');
            hasI18nStructure = i18nDbService.hasI18nStructure(label);
            expect(hasI18nStructure).toBe(true);
        });
    });

    describe('setInitI18nStructure', function() {
        it('should initialize in the default language the i18n structure of a non i18n related string', function() {
            var label = 'hellow i18n',
                initI18nStructure = i18nDbService.setInitI18nStructure(label);
            expect(initI18nStructure.en.text).toBe(label);
        });
        it('should initialize in the default language the i18n structure of a non i18n related string even changing the language', function() {
            var label = 'hellow i18n',
                initI18nStructure;
            i18nService.changeLanguage('es');
            initI18nStructure = i18nDbService.setInitI18nStructure(label);
            expect(initI18nStructure.en.text).toBe(label);
            expect(initI18nStructure.es).toBe(undefined);
        });
    });
});