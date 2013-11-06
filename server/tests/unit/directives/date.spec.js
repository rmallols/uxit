describe('date directive', function () {

    var $rootScope, $scope, $compile, dateDirective;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", function ($rootScope_, $compile_) {
        $compile        = $compile_;
        $rootScope      = $rootScope_;
        $scope          = $rootScope.$new();
        $scope.user     = {
            birthDate: '2011-02-30'
        };
        compile();
    }]));

    describe('main DOM structure', function () {

        it('should have the "type" attribute set to "text', function () {
            expect(dateDirective.attr('type')).toBe('text');
        });

        it('should have the "ui-date" attribute set to "dateOptions', function () {
            expect(dateDirective.attr('ui-date')).toBe('dateOptions');
        });

        it('should have the "ui-date-format" attribute set to "yy-mm-dd', function () {
            expect(dateDirective.attr('ui-date-format')).toBe('yy-mm-dd');
        });
    });

    function compile() {
        var template    = '<div date ng-model="user.birthDate"></div>',
            compile     = compileFn($compile, $scope);
        dateDirective   = compile(template);
        $rootScope.$digest();
    }
});