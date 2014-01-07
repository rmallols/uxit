describe('background directive', function () {

    var $rootScope, $scope, $httpBackend, compile, template, backgroundDirective;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$httpBackend",
    function ($rootScope_, $compile_, $httpBackend_) {
        $rootScope      = $rootScope_;
        $scope          = $rootScope_.$new();
        $httpBackend    = $httpBackend_;
        compile         = compileFn($compile_, $scope);
        template        = '<background ng-model="model.background"></background>';
    }]));

    describe('DOM structure', function() {

        beforeEach(function() {
            backgroundDirective = compile(template, {});
            $rootScope.$digest();
        });

        describe('color', function() {

            var colorCol;
            beforeEach(function() {
                colorCol = $(' .columns:eq(0)', backgroundDirective);
            });

            it('should have the proper label', function () {
                expect($('label', colorCol).attr('i18n')).toBe('editStyles.background.color');
            });

            it('should have the proper input', function () {
                expect($('[color-picker]', colorCol).attr('ng-model')).toBe('background.color');
            });
        });

        describe('src', function() {

            var srcCol;
            beforeEach(function() {
                srcCol = $(' .columns:eq(1)', backgroundDirective);
            });

            it('should have the proper label', function () {
                expect($('label', srcCol).attr('i18n')).toBe('editStyles.background.src');
            });

            it('should have the proper input', function () {
                expect($('.mediaPicker', srcCol).attr('ng-model')).toBe('backgroundSrc');
            });
        });

        describe('repeat', function() {

            var repeatCol;
            beforeEach(function() {
                repeatCol = $(' .columns:eq(2)', backgroundDirective);
            });

            it('should have the proper label', function () {
                expect($('label', repeatCol).attr('i18n')).toBe('editStyles.background.repeat');
            });

            it('should have the proper input', function () {
                expect($('input[type="checkbox"]', repeatCol).attr('ng-model')).toBe('background.mosaic');
            });
        });

        describe('top pos', function() {

            var topPosCol;
            beforeEach(function() {
                topPosCol = $(' .columns:eq(3)', backgroundDirective);
            });

            it('should have the proper label', function () {
                expect($('label', topPosCol).attr('i18n')).toBe('editStyles.background.position.top');
            });

            it('should have the proper input', function () {
                expect($('select', topPosCol).attr('ng-model')).toBe('background.position.top');
            });
        });

        describe('left pos', function() {

            var leftCol;
            beforeEach(function() {
                leftCol = $(' .columns:eq(4)', backgroundDirective);
            });

            it('should have the proper label', function () {
                expect($('label', leftCol).attr('i18n')).toBe('editStyles.background.position.left');
            });

            it('should have the proper input', function () {
                expect($('select', leftCol).attr('ng-model')).toBe('background.position.left');
            });
        });
    });

    describe('element visibility', function() {

        describe('elements hidden by default', function() {

            it('should not show the repeat column if there isn\'t background image selected', function () {
                var backgroundDirective, repeatCol;
                backgroundDirective = compile(template, {});
                $rootScope.$digest();
                repeatCol = $(' .columns:eq(2)', backgroundDirective);
                expect(isVisible(repeatCol)).toBe(false);
            });

            it('should not show the top pos column if there isn\'t background image selected', function () {
                var backgroundDirective, topPosCol;
                backgroundDirective = compile(template, {});
                $rootScope.$digest();
                topPosCol = $(' .columns:eq(3)', backgroundDirective);
                expect(isVisible(topPosCol)).toBe(false);
            });

            it('should not show the left pos column if there isn\'t background image selected', function () {
                var backgroundDirective, leftPosCol;
                backgroundDirective = compile(template, {});
                $rootScope.$digest();
                leftPosCol = $(' .columns:eq(4)', backgroundDirective);
                expect(isVisible(leftPosCol)).toBe(false);
            });
        });


        describe('elements that could appear', function() {

            var mediaId;
            beforeEach(function() {
                mediaId = '0011AA';
                $scope.model = { background: { src: mediaId }};
                $httpBackend.when('GET', 'rest/media/' + mediaId + '?projection[data]=0').respond({ _id: mediaId});
                backgroundDirective = compile(template, {});
                $rootScope.$digest();
                $httpBackend.flush();
            });

            it('should show the repeat column if there\'s background image selected', function () {
                var backgroundDirective, repeatCol;
                $scope.model = { background: { src: mediaId }};
                $httpBackend.when('GET', 'rest/media/' + mediaId + '?projection[data]=0').respond({ _id: mediaId});
                backgroundDirective = compile(template, {});
                $rootScope.$digest();
                $httpBackend.flush();
                repeatCol = $(' .columns:eq(2)', backgroundDirective);
                expect(isVisible(repeatCol)).toBe(true);
            });

            it('should not show the top pos column if there\'s background image selected but ' +
                'the repeat check is marked', function () {
                var topPosCol;
                $scope.model.background.mosaic = true;
                $scope.$apply();
                topPosCol = $(' .columns:eq(3)', backgroundDirective);
                expect(isVisible(topPosCol)).toBe(false);
            });

            it('should not show the left pos column if there\'s background image selected but ' +
                'the repeat check is marked', function () {
                var leftPosCol;
                $scope.model.background.mosaic = true;
                $scope.$apply();
                leftPosCol = $(' .columns:eq(4)', backgroundDirective);
                expect(isVisible(leftPosCol)).toBe(false);
            });

            it('should show the top pos column if there\'s background image selected and ' +
                'the repeat check is not marked', function () {
                var topPosCol;
                $scope.model.background.mosaic = false;
                $scope.$apply();
                topPosCol = $(' .columns:eq(3)', backgroundDirective);
                expect(isVisible(topPosCol)).toBe(true);
            });

            it('should show the left pos column if there\'s background image selected and ' +
                'the repeat check is not marked', function () {
                var leftPosCol;
                $scope.model.background.mosaic = false;
                $scope.$apply();
                leftPosCol = $(' .columns:eq(4)', backgroundDirective);
                expect(isVisible(leftPosCol)).toBe(true);
            });
        });
    });
});