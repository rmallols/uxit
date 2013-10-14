describe('app directive', function () {

    var $rootScope, $scope, $compile, $httpBackend, listDirective, roleService;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", "$httpBackend", "roleService",
    function ($rootScope_, $compile_, $document_, $httpBackend_, roleService_) {
        var template;
        $rootScope      = $rootScope_;
        $httpBackend    = $httpBackend_;
        $scope          = $rootScope.$new();
        $compile        = compileFn($compile_, $scope/*, $document_*/);
        roleService     = roleService_;
        $scope.config   = {};
        loadRoles($httpBackend, roleService, function(roleList) {
            $scope.roleList = roleList;
        });
        template        = '<div list="roleList" collection="collection" config="config" ' +
                          'transcluded-data="transcludedData" template="template" ' +
                          'internal-data="internalData" on-select-panels="onSelectPanels" ' +
                          'on-create="onCreate($item)" on-delete="onDelete($id)"></div>';
        listDirective    = $compile(template, {});
        $rootScope.$digest();
    }]));

    describe('general DOM structure', function () {

        it('should add the \'scrollable\' styleclass to the root element', function () {
            expect(listDirective.hasClass('scrollable')).toBe(true);
        });
    });

    describe('items size', function () {

        it('should not show the \'no items\' block if there\'re available content to show', function () {
            expect($('.noItems', listDirective).is(':visible')).toBe(false);
        });

        it('should add to the DOM the proper amount of items', function () {
            expect($('.item.columns', listDirective).length).toBe($scope.roleList.length);
        });
    });

    describe('search', function () {

        iit('should show the search area by default', function () {
            expect(isVisible($('.searchArea', listDirective))).toBe(true);
        });

        iit('should show the search area if it has been explicitly marked as visible', function () {
            $scope.config.searchable = true;
            $rootScope.$digest();
            expect(isVisible($('.searchArea', listDirective))).toBe(true);
        });

        iit('should not show the search area if it has been explicitly marked as invisible', function () {
            $scope.config.searchable = false;
            $rootScope.$digest();
            expect(isVisible($('.searchArea', listDirective))).toBe(false);
        });
    });
});