describe('mediaPicker directive', function () {

    var $rootScope, $scope, $compile, $timeout, compile, template, objectService;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "objectService", "$timeout",
    function ($rootScope_, $compile_, objectService_, $timeout_) {
        $rootScope      = $rootScope_;
        $scope          = $rootScope_.$new();
        $timeout        = $timeout_;
        compile         = compileFn($compile_, $scope);
        template        = '<media-picker preview="{{preview}}" ng-model="user.media" default-media-url="defaultAvatarUrl"></media-picker>';
    }]));

    describe('DOM structure', function() {

        it('should have the specific class on the root element', function () {
            var mediaPickerDirective = compile(template, { user: {}});
            $rootScope.$digest();
            expect(mediaPickerDirective.hasClass('mediaPicker')).toBe(true);
        });

        it('should have a media selection button', function () {
            var mediaPickerDirective = compile(template, { user: {}});
            $rootScope.$digest();
            expect($(' > button.mediaIcon[ng-click="selectFromMediaList()"]', mediaPickerDirective).length).toBe(1);
        });

        it('should have a image container', function () {
            var mediaPickerDirective = compile(template, { user: {}});
            $rootScope.$digest();
            expect($(' > img.current', mediaPickerDirective).length).toBe(1);
        });

        it('should have a remove selected media button', function () {
            var mediaPickerDirective = compile(template, { user: {}});
            $rootScope.$digest();
            expect($(' > button.removeIcon[ng-click="deleteSelection()"]', mediaPickerDirective).length).toBe(1);
        });
    });

    describe('Image url', function() {

        it('should not have any src attribute if no default image is set', function () {
            var mediaPickerDirective = compile(template, { user: {}});
            $rootScope.$digest();
            expect($(' > img.current', mediaPickerDirective).attr('src')).toBe(undefined);
        });

        it('should have a default src attribute if the specific media is not provided but the default one is', function () {
            var mediaPickerDirective = compile(template, { user: {}, defaultAvatarUrl: 'test.png'});
            $rootScope.$digest();
            expect($(' > img.current', mediaPickerDirective).attr('src')).toBe('test.png');
        });

        it('should have a specific src attribute if the specific media is provided - default not defined', function () {
            var mediaPickerDirective = compile(template, { user: { media: { _id: '_testId', name: 'bla.png'}}});
            $rootScope.$digest();
            expect($(' > img.current', mediaPickerDirective).attr('src')).toBe('media/_testId/bla.png');
        });

        it('should have a specific src attribute if the specific media is provided - default defined', function () {
            var mediaPickerDirective = compile(template, { user: { media: { _id: '_testId', name: 'bla.png'}}, defaultAvatarUrl: 'test.png'});
            $rootScope.$digest();
            expect($(' > img.current', mediaPickerDirective).attr('src')).toBe('media/_testId/bla.png');
        });
    });

    describe('Image preview visibility', function() {

        it('should not show the image preview if it has not been explicitly defined', function () {
            var mediaPickerDirective = compile(template, { user: {}});
            $rootScope.$digest();
            expect(isVisible($(' > img.current', mediaPickerDirective))).toBe(false);
        });

        it('should not show the image preview if it has been explicitly defined as false', function () {
            var mediaPickerDirective = compile(template, { user: {}, preview: false});
            $rootScope.$digest();
            expect(isVisible($(' > img.current', mediaPickerDirective))).toBe(false);
        });

        it('should not show the image preview if it has been explicitly defined as true', function () {
            var mediaPickerDirective = compile(template, { user: {}, preview: true});
            $rootScope.$digest();
            expect(isVisible($(' > img.current', mediaPickerDirective))).toBe(true);
        });
    });

    describe('Remove selected media', function() {

        it('should not show the remove selected media button if there isn\'t any selected media', function () {
            var mediaPickerDirective = compile(template, { user: {}});
            $rootScope.$digest();
            expect(isVisible($(' > button.removeIcon', mediaPickerDirective))).toBe(false);
        });

        it('should show the remove selected media button if there is a selected media', function () {
            var mediaPickerDirective = compile(template, { user: { media: { _id: '_testId', name: 'bla.png'}}, defaultAvatarUrl: 'test.png'});
            $rootScope.$digest();
            expect(isVisible($(' > button.removeIcon', mediaPickerDirective))).toBe(true);
        });
    });
});