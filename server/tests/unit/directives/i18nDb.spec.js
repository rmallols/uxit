describe('i18nDb directive', function () {

    var $scope, compile, template, i18nService;

    beforeEach(module('components'));
    beforeEach(inject(["$rootScope", "$compile", "i18nService",
    function ($rootScope_, $compile_, i18nService_) {
        $scope      = $rootScope_.$new();
        compile     = compileFn($compile_, $scope);
        i18nService = i18nService_;
        template    = '<label i18n-db="page.title"></label>';
    }]));

    describe('if there isn\'t i18n info present', function () {
        it('should publish the original label', function () {
            var scopeObj        = { page: { title: 'Test value without translation'}},
                i18nDbDirective = compile(template, scopeObj);
            expect(i18nDbDirective.text()).toBe(scopeObj.page.title);
        });
    });

    describe('if there\'s i18n info present just in the default language', function () {
        it('should publish the default i18n label', function () {
            var scopeObj        = { page: { title: { en: { text: 'Test value with translation'}}}},
                i18nDbDirective = compile(template, scopeObj);
            expect(i18nDbDirective.text()).toBe(scopeObj.page.title.en.text);
        });
        it('should publish the translated i18n label after language change', function () {
            var scopeObj        = { page: { title: { en: { text: 'Test value with translation'}}}},
                i18nDbDirective = compile(template, scopeObj);
            i18nService.changeLanguage('es');
            expect(i18nDbDirective.text()).toBe(scopeObj.page.title.en.text);
        });
    });

    describe('if there\'s i18n info present in all languages', function () {
        it('should publish the proper i18n label after language change', function () {
            var scopeObj = { page: { title: {
                    en: { text: 'Test value with translation'},
                    es: { text: 'Test valor con traducción'}
                }}}, i18nDbDirective;
            i18nService.changeLanguage('es');
            i18nDbDirective = compile(template, scopeObj);
            expect(i18nDbDirective.text()).toBe(scopeObj.page.title.es.text);
        });
    });
});