describe('tooltip directive', function () {

    var $scope, $compile, compile, template, titleDirective;

    beforeEach(module('components', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", function ($rootScope_, $compile_, $document_) {
        $scope          = $rootScope_.$new();
        compile         = compileFn($compile_, $scope, $document_);
        template        = '<div title="hello"></div>';
        //titleDirective  = compile(template, {});
        $rootScope_.$digest();
    }]));

    xit('should xxx', function () {
        expect(true).toBe(true);
    });
});