describe('fileuploader directive', function () {

    var $rootScope, $scope, $compile, fileUploaderDirective;

    beforeEach(module('components', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", function ($rootScope_, $compile_, $document_) {
        var template    = '<file-uploader preview="true" ng-model="user.media" multiple="false" ' +
                          'default-media-url="defaultAvatarUrl"></file-uploader>';
        $rootScope      = $rootScope_;
        $scope          = $rootScope.$new();
        $compile        = compileFn($compile_, $scope, $document_);
        fileUploaderDirective = $compile(template, {});
    }]));

    xit('should bla', function () {
        //$rootScope.$digest();
        dump(fileUploaderDirective);
        expect('').toBe('');
    });
});