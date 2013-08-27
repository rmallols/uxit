describe('app directive', function () {

    var $rootScope, $scope, $compile, appDirective;

    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "$compile", function ($rootScope_, $compile_) {
        $rootScope = $rootScope_;
        $scope = $rootScope_.$new();
        $compile = $compile_;
        appDirective = $compile('<div app></div>')($scope);
    }]));
});