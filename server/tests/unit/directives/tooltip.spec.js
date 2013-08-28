describe('tooltip directive and service', function () {

    var $rootScope, $scope, $compile, tS, template, titleDirective, tooltipObj;

    beforeEach(module('components', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", "tooltipService",
    function ($rootScope_, $compile_, $document_, tooltipService_) {
        $rootScope      = $rootScope_;
        $scope          = $rootScope.$new();
        $compile        = compileFn($compile_, $scope, $document_);
        tS              = tooltipService_;
    }]));

    it('should add a tooltip object to the DOM', function () {
        template        = '<div title="hello"></div>';
        titleDirective  = $compile(template, {});
        $rootScope.$digest();
        tooltipObj      = $('#powerTip');
        expect(tooltipObj.size()).toBe(1);
        expect(tooltipObj.text()).toBe('');
    });

    it('should add the title to the DOM whenever the tooltip is shown', function () {
        template        = '<div title="hello"></div>';
        titleDirective  = $compile(template, {});
        $rootScope.$digest();
        tooltipObj      = $('#powerTip');
        tS.show(titleDirective);
        expect(tooltipObj.text()).toBe('hello');
    });

    xit('should model', function () {
        template        = '<div title="{{hello}}"></div>';
        titleDirective  = $compile(template, { hello: 'aaaa'});
        $rootScope.$digest();
        tooltipObj      = $('#powerTip');
        tS.show(titleDirective);
        dump(titleDirective, tooltipObj);
        //expect(tooltipObj.text()).toBe('hello');
    });
});