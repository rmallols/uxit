describe('caret service', function () {

    var $rootScope, $scope, $compile, caretService;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "caretService",
    function ($rootScope_, $compile_, caretService_) {
        $rootScope      = $rootScope_;
        $scope          = $rootScope.$new();
        $compile        = compileFn($compile_, $scope);
        caretService    = caretService_;
    }]));

    xdescribe('root element', function () {

        it('should have the form tag', function () {
            var template =  '<div content-editable ng-model="content"></div>',
                contentEditableDirective = $compile(template, { content: 'test content'}),
                cEDomObj;
            $rootScope.$digest();
            cEDomObj = $(' > .editableArea > [contenteditable]', contentEditableDirective);
            caretService.insertImage('http://www.google.es', cEDomObj, null);
            //expect(contentEditableDirective.is('form')).toBe(true);
        });
    });
});