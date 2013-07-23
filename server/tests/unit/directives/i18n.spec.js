describe('i18n directive', function () {

    var $scope, compile, template, i18nService;

    beforeEach(module('components', 'mocks.i18nSpy'));
    beforeEach(inject(["$rootScope", "$compile", "i18nService",
    function ($rootScope_, $compile_, i18nService_) {
        $scope      = $rootScope_.$new();
        compile     = compileFn($compile_, $scope);
        i18nService = i18nService_;
        template    = '<label i18n="editGeneral.general.portalDescription"></label>';
    }]));

    it('should publish the proper i18n label', function () {
        var translatedLabel = 'hello world', i18nDirective;
        i18nService.andReturn(translatedLabel);
        i18nDirective = compile(template, {});
        expect(i18nDirective.attr('i18n')).not.toBe(undefined);
        expect(i18nDirective.text()).toBe(translatedLabel);
    });
});