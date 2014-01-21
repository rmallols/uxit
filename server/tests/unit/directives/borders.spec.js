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
});