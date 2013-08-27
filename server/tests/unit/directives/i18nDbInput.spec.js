describe('i18nDbInput directive', function () {

    var $scope, compile, template, i18nService;

    beforeEach(module('components'));
    beforeEach(inject(["$rootScope", "$compile", "i18nService",
    function ($rootScope_, $compile_, i18nService_) {
        $scope      = $rootScope_.$new();
        compile     = compileFn($compile_, $scope);
        i18nService = i18nService_;
        template    = '<input i18n-db-input ng-model="page.title" />';
    }]));

    describe('if there isn\'t i18n info present', function () {
        it('should publish the original value, already with the proper i18n format', function () {
            var scopeObj = { page: { title: 'Test value without translation'}},
                i18nDbInputDirective = compile(template, scopeObj);
            expect(i18nDbInputDirective.val()).toBe(scopeObj.page.title.en.text);
        });
        it('should publish the original value, already with the proper i18n format, once a language change happens', function () {
            var scopeObj = { page: { title: 'Test value without translation'}},
                i18nDbInputDirective;
            i18nService.changeLanguage('es');
            i18nDbInputDirective = compile(template, scopeObj);
            expect(i18nDbInputDirective.val()).toBe(scopeObj.page.title.en.text);
        });
    });

    describe('if there\'s i18n info present in just the default language', function () {
        it('should publish the original value, already with the proper i18n format', function () {
            var scopeObj = { page: { title: { en: { text: 'Test value without translation'}}}},
                i18nDbInputDirective = compile(template, scopeObj);
            expect(i18nDbInputDirective.val()).toBe(scopeObj.page.title.en.text);
        });
        it('should publish the original value, already with the proper i18n format, once a language change happens', function () {
            var scopeObj = { page: { title: { en: { text: 'Test value without translation'}}}},
                i18nDbInputDirective;
            i18nService.changeLanguage('es');
            i18nDbInputDirective = compile(template, scopeObj);
            expect(i18nDbInputDirective.val()).toBe(scopeObj.page.title.en.text);
        });
        xit('should block the edit capabilities in languages where there isn\'t available content till it\'s clicked', function () {
            var scopeObj = { page: { title: { en: { text: 'Test value without translation'}}}},
                i18nDbInputDirective;
            i18nService.changeLanguage('es');
            i18nDbInputDirective = compile(template, scopeObj);
            expect(i18nDbInputDirective.attr('readonly')).toBe('readonly');
            i18nDbInputDirective.click();
            expect(i18nDbInputDirective.attr('readonly')).toBe(undefined);
        });
    });

    describe('if there\'s i18n info present in different languages', function () {
        it('should publish the original value, already with the proper i18n format', function () {
            var scopeObj = { page: { title: {
                    en: { text: 'Test value without translation'},
                    es: { text: 'Test valor con traducción'}
                }}},
                i18nDbInputDirective = compile(template, scopeObj);
            expect(i18nDbInputDirective.val()).toBe(scopeObj.page.title.en.text);
        });
        it('should publish the translated value, already with the proper i18n format, once a language change happens', function () {
            var scopeObj = { page: { title: {
                    en: { text: 'Test value without translation'},
                    es: { text: 'Test valor con traducción'}
                }}},
                i18nDbInputDirective;
            i18nService.changeLanguage('es');
            i18nDbInputDirective = compile(template, scopeObj);
            expect(i18nDbInputDirective.val()).toBe(scopeObj.page.title.es.text);
        });
        it('should not block the edit capabilities in languages where there\'s available content', function () {
            var scopeObj = { page: { title: {
                    en: { text: 'Test value without translation'},
                    es: { text: 'Test valor con traducción'}
                }}},
                i18nDbInputDirective;
            i18nService.changeLanguage('es');
            i18nDbInputDirective = compile(template, scopeObj);
            expect(i18nDbInputDirective.attr('readonly')).toBe(undefined);
            i18nDbInputDirective.click();
            expect(i18nDbInputDirective.attr('readonly')).toBe(undefined);
        });
    });
});