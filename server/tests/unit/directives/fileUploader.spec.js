describe('fileuploader directive', function () {

    var $rootScope, $scope, $compile;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", function ($rootScope_, $compile_, $document_) {
        $rootScope      = $rootScope_;
        $scope          = $rootScope.$new();
        $compile        = compileFn($compile_, $scope, $document_);
    }]));

    describe('root element', function () {

        it('should have the form tag', function () {
            var template =  '<file-uploader></file-uploader>',
                fileUploaderDirective = $compile(template, {});
            $rootScope.$digest();
            expect(fileUploaderDirective.is('form')).toBe(true);
        });

        it('should have the proper enctype attribute', function () {
            var template =  '<file-uploader></file-uploader>',
                fileUploaderDirective = $compile(template, {});
            $rootScope.$digest();
            expect(fileUploaderDirective.attr('enctype')).toBe('multipart/form-data');
        });

        it('should set the submit method to POST', function () {
            var template =  '<file-uploader></file-uploader>',
                fileUploaderDirective = $compile(template, {});
            $rootScope.$digest();
            expect(fileUploaderDirective.attr('method')).toBe('post');
        });

        it('should set the \'fileUploader\' style class', function () {
            var template =  '<file-uploader></file-uploader>',
                fileUploaderDirective = $compile(template, {});
            $rootScope.$digest();
            expect(fileUploaderDirective.hasClass('fileUploader')).toBe(true);
        });

        it('should point to a default endpoint if it\'s not specified', function () {
            var template =  '<file-uploader></file-uploader>',
                fileUploaderDirective = $compile(template, {});
            $rootScope.$digest();
            expect(fileUploaderDirective.attr('action')).toBe('/media/upload/');
        });

        it('should point to a specific endpoint if it\'s specified', function () {
            var template =  '<file-uploader endpoint="/test/endpoint"></file-uploader>',
                fileUploaderDirective = $compile(template, {});
            $rootScope.$digest();
            expect(fileUploaderDirective.attr('action')).toBe('/test/endpoint');
        });
    });

    describe('input file', function () {

        it('should wrap a single input file', function () {
            var template =  '<file-uploader></file-uploader>',
                fileUploaderDirective = $compile(template, {});
            $rootScope.$digest();
            expect($('input[type="file"]', fileUploaderDirective).size()).toBe(1);
        });

        it('should have the proper ng-model attribute', function () {
            var template =  '<file-uploader></file-uploader>',
                fileUploaderDirective = $compile(template, {});
            $rootScope.$digest();
            expect($('input[type="file"]', fileUploaderDirective).attr('ng-model')).toBe('files');
        });

        it('should have the proper ux-change attribute', function () {
            var template =  '<file-uploader></file-uploader>',
                fileUploaderDirective = $compile(template, {});
            $rootScope.$digest();
            expect($('input[type="file"]', fileUploaderDirective).attr('ux-change')).toBe('submit()');
        });

        it('should have the proper name attribute', function () {
            var template =  '<file-uploader></file-uploader>',
                fileUploaderDirective = $compile(template, {});
            $rootScope.$digest();
            expect($('input[type="file"]', fileUploaderDirective).attr('name')).toBe('upload');
        });

        it('should not have the multiple files tag if it\'s not defined', function () {
            var template =  '<file-uploader></file-uploader>',
                fileUploaderDirective = $compile(template, {});
            $rootScope.$digest();
            expect($('input[type="file"]', fileUploaderDirective).attr('multiple-files')).toBe('');
        });

        it('should have the multiple files tag if it\'s defined', function () {
            var template =  '<file-uploader multiple="true"></file-uploader>',
                fileUploaderDirective = $compile(template, {});
            $rootScope.$digest();
            expect($('input[type="file"]', fileUploaderDirective).attr('multiple-files')).toBe('true');
        });
    });
});