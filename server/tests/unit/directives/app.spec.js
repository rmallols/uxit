describe('app directive', function () {

    var $rootScope, $scope, $compile;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", function ($rootScope_, $compile_, $document_) {
        $rootScope      = $rootScope_;
        $scope          = $rootScope.$new();
        $compile        = compileFn($compile_, $scope, $document_);
    }]));

    describe('root element', function () {

        xit('should have the form tag', function () {
            var model = {
                    app: {
                            id      : 'testApp',
                            type    : 'staticContentApp',
                            model   : {},
                            size    : 25
                        }
                },
                template =  '<li app="app.id"  model="app.model" type="app.type" template-app="true" width="app.size"></li>',
                appDirective = $compile(template, model);
            $rootScope.$digest();
            dump(appDirective);
            //expect(appDirective.is('form')).toBe(true);
        });
    });
});