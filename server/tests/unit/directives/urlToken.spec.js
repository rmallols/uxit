describe('urlToken directive', function () {

    var $rootScope, $scope, $compile, urlTokenElm, i18nDS;

    beforeEach(module('components'));
    beforeEach(inject(["$rootScope", "$compile", "i18nService", function ($rootScope_, $compile_, i18nDS_) {
        $compile        = $compile_;
        $rootScope      = $rootScope_;
        $scope          = $rootScope.$new();
        i18nDS          = i18nDS_;
        $scope.model    = {
            output  : ''
        };
        compile();
    }]));

    describe('main DOM structure', function () {

        it('should generate a "label" element', function () {
            dump(urlTokenElm.text());
            expect(urlTokenElm.is('label')).toBeTruthy();
        });
    });

    describe('text transformations - no i18n data structure', function () {

        it('should use the same output if the input fits a url pattern - single word', function () {
            $scope.model.input = 'test';
            $rootScope.$digest();
            expect(urlTokenElm.text()).toBe($scope.model.input);
        });

        it('should use the same output if the input fits a url pattern - multiple word', function () {
            $scope.model.input = 'testPortal';
            $rootScope.$digest();
            expect(urlTokenElm.text()).toBe($scope.model.input);
        });

        it('should use the a normalized output if the input doesn\'t fit a url pattern - spaces', function () {
            $scope.model.input = 'test portal';
            $rootScope.$digest();
            expect(urlTokenElm.text()).toBe('testPortal');
        });

        it('should use the a normalized output if the input doesn\'t fit a url pattern - dashes', function () {
            $scope.model.input = 'test-portal';
            $rootScope.$digest();
            expect(urlTokenElm.text()).toBe('testPortal');
        });
    });

    describe('text transformations - i18n data structure', function () {

        it('should use the same output if the input fits a url pattern - single word', function () {
            $scope.model.input = {
                en: { text: 'Testen'},
                es: { text: 'Testes'}
            };
            i18nDS.changeLanguage('en');
            $rootScope.$digest();
            expect(urlTokenElm.text()).toBe($scope.model.input.en.text);
        });

        it('should use the same output if the input fits a url pattern - multiple word', function () {
            $scope.model.input = {
                en: { text: 'TestEn'},
                es: { text: 'TestEs'}
            };
            i18nDS.changeLanguage('en');
            $rootScope.$digest();
            expect(urlTokenElm.text()).toBe($scope.model.input.en.text);
        });

        it('should use the same output if the input fits a url pattern - multiple word, language change', function () {
            $scope.model.input = {
                en: { text: 'TestEn'},
                es: { text: 'TestEs'}
            };
            i18nDS.changeLanguage('es');
            $rootScope.$digest();
            expect(urlTokenElm.text()).toBe($scope.model.input.es.text);
        });

        it('should use the a normalized output if the input doesn\'t fit a url pattern - dashes, language change', function () {
            $scope.model.input = {
                en: { text: 'Test english'},
                es: { text: 'Test spanish'}
            };
            i18nDS.changeLanguage('es');
            $rootScope.$digest();
            expect(urlTokenElm.text()).toBe('TestSpanish');
        });
    });

    function compile() {
        var template    = '<label url-token input="model.input" output="model.output"></label>',
            compile     = compileFn($compile, $scope);
        urlTokenElm     = compile(template);
        $rootScope.$digest();
    }
});