describe('borders directive', function () {

    var $rootScope, $scope, $httpBackend, compile, template, bordersDirective;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$httpBackend",
    function ($rootScope_, $compile_, $httpBackend_) {
        $rootScope      = $rootScope_;
        $scope          = $rootScope_.$new();
        $httpBackend    = $httpBackend_;
        compile         = compileFn($compile_, $scope);
        template        = '<borders ng-model="model.borders"></borders>';
    }]));

    describe('DOM structure', function() {

        beforeEach(function() {
            bordersDirective = compile(template, {});
            $rootScope.$digest();
        });

        describe('color', function() {

            var colorCol;
            beforeEach(function() {
                colorCol = $(' .columns:eq(0)', bordersDirective);
            });

            it('should have the proper label', function () {
                expect($('label', colorCol).attr('i18n')).toBe('editStyles.borders.color');
            });

            it('should have the proper input', function () {
                expect($('[color-picker]', colorCol).attr('ng-model')).toBe('borders.color');
            });
        });

        describe('width', function() {

            var widthCol;
            beforeEach(function() {
                widthCol = $(' .columns:eq(1)', bordersDirective);
            });

            it('should have the proper label', function () {
                expect($('label', widthCol).attr('i18n')).toBe('editStyles.borders.width');
            });

            it('should have the proper input', function () {
                expect($('input[type="number"]', widthCol).attr('ng-model')).toBe('borders.width');
            });
        });

        describe('style', function() {

            var styleCol;
            beforeEach(function() {
                styleCol = $(' .columns:eq(2)', bordersDirective);
            });

            it('should have the proper label', function () {
                expect($('label', styleCol).attr('i18n')).toBe('editStyles.borders.style');
            });

            it('should have the proper input', function () {
                expect($('select', styleCol).attr('ng-model')).toBe('borders.style');
            });
        });
    });

    describe('element visibility', function() {

        var bordersDirective, styleCol;
        beforeEach(function() {
            bordersDirective = compile(template, {});
            $rootScope.$digest();
            styleCol = $(' .columns:eq(2)', bordersDirective);
        });

        it('should not show the style column if there isn\'t set', function () {
            expect(isVisible(styleCol)).toBe(false);
        });

        it('should not show the style column if the color is set to transparent', function () {
            $scope.model = { borders: { color: 'transparent' }};
            $rootScope.$digest();
            expect(isVisible(styleCol)).toBe(false);
        });

        it('should not show the style column if the color is set to something different than transparent ' +
        'but the border width is still set to 0', function () {
            $scope.model = { borders: { color: '#00aaef' }};
            $rootScope.$digest();
            expect(isVisible(styleCol)).toBe(false);
        });

        it('should show the style column if the color is set to something different than transparent ' +
            'and the border width is still set to something different than 0', function () {
            $scope.model = { borders: { color: '#00aaef', width: 3 }};
            $rootScope.$digest();
            expect(isVisible(styleCol)).toBe(true);
        });
    });
});