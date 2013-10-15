describe('tooltip directive and service', function () {

    var $rootScope, $scope, $compile, tS, iS, template, titleDirective, tooltipObj;

    beforeEach(module('components', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "tooltipService", "i18nService",
    function ($rootScope_, $compile_, tooltipService_, i18nService_) {
        $rootScope      = $rootScope_;
        $scope          = $rootScope.$new();
        $compile        = compileFn($compile_, $scope);
        tS              = tooltipService_;
        iS              = i18nService_;
    }]));

    it('should add a tooltip object to the DOM', function () {
        template        = '<button title="hello"></button>';
        titleDirective  = $compile(template, {});
        $rootScope.$digest();
        tooltipObj      = $('#powerTip');
        expect(tooltipObj.size()).toBe(1);
        expect(tooltipObj.text()).toBe('');
        tS.hide();
    });

    it('should add the static title to the DOM whenever the tooltip is shown', function () {
        template        = '<button title="hello"></button>';
        titleDirective  = $compile(template, {});
        $rootScope.$digest();
        tooltipObj      = $('#powerTip');
        tS.show(titleDirective);
        expect(tooltipObj.text()).toBe('hello');
        tS.hide();
    });

    it('should add the dynamic title to the DOM whenever the tooltip is shown', function () {
        template        = '<button title="{{hello}}"></button>';
        titleDirective  = $compile(template, { hello: 'test value'});
        $rootScope.$digest();
        tooltipObj      = $('#powerTip');
        tS.show(titleDirective);
        expect(tooltipObj.text()).toBe('test value');
        tS.hide();
        $scope.hello = 'test second value';
        $scope.$digest();
        tS.show(titleDirective);
        expect(tooltipObj.text()).toBe('test second value');
        tS.hide();
    });

    it('should add the dynamic title (i18n based) to the DOM whenever the tooltip is shown', function () {
        template        = '<button title="{{hello}}" i18n-db-title></button>';
        titleDirective  = $compile(template, { hello: { en: { text: 'test value'}, es: { text: 'test valor'}}});
        $rootScope.$digest();
        tooltipObj      = $('#powerTip');
        iS.changeLanguage('en');
        tS.show(titleDirective);
        expect(tooltipObj.text()).toBe('test value');
        iS.changeLanguage('es');
        tS.hide();
        $scope.$digest();
        tS.show(titleDirective);
        expect(tooltipObj.text()).toBe('test valor');
        tS.hide();
    });

    it('should show the confirm action whenever the element is clicked', function () {
        template        = '<button title="{{hello}}" i18n-db-title confirm-action="bla(1)"></button>';
        titleDirective  = $compile(template, { hello: { en: { text: 'test value'}, es: { text: 'test valor'}}});
        $rootScope.$digest();
        tooltipObj      = $('#powerTip');
        iS.changeLanguage('en');
        tS.show(titleDirective);
        expect(tooltipObj.text()).toBe('test value');
        tS.hide();
        titleDirective.click();
        $scope.$digest();
        expect(tooltipObj.text()).toBe('[areYouSure]');
        tS.hide();
        iS.changeLanguage('es');
        $scope.$digest();
        tS.show(titleDirective);
        expect(tooltipObj.text()).toBe('test valor');
        tS.hide();
    });
});