describe('nestedItemsWrapper directive', function () {
    'use strict';
    var $scope, compile, template;
    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "$compile", "$httpBackend", "pageService",
    function ($rootScope, $compile, $httpBackend, pageService) {
            loadPages($httpBackend, pageService);
            $scope = $rootScope.$new();
            compile = compileFn($compile, $scope);
            template = '<nested-pages-wrapper items="items" pages="pages" selected-item="selectedItem"></nested-pages-wrapper>';
        }]));

    it('should detect the correct amount of items', function () {
        var childScope, nestedItemsWrapperDirective;
        nestedItemsWrapperDirective = compile(template, {});
        childScope = nestedItemsWrapperDirective.scope();
        expect(childScope.pages.length).toBe(3);
    });
});