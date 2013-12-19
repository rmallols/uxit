describe('bannerItem directive', function () {

    var $rootScope, $scope, $compile, bannerItemElm, bIS, model, imagePath, borders;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", "bannerImageService",
    function ($rootScope_, $compile_, $document_, bannerImageService_) {
        model           = { "id":1380531241893,"type":"image","value":"image.png",
                            "size":{"width":100,"height":100},"position":{"top":50,"left":300}};
        $rootScope      = $rootScope_;
        $scope          = $rootScope.$new();
        $scope.model    = model;
        $scope.overflow = { visible: false };
        $compile        = compileFn($compile_, $scope, $document_);
        bIS             = bannerImageService_;
        imagePath       = ' > [ux-transclude] > .item.image';
        borders         = { horizontal: 5, vertical: 10 };
        compile();
    }]));

    describe('getTemplate', function () {

        it('should have an img root element', function () {
            expect($(bIS.getTemplate()).is('img')).toBe(true);
        });

        it('should have the ng-src directive in the root element', function () {
            expect($(bIS.getTemplate()).attr('ng-src')).toBe('{{item.value}}');
        });
    });

    describe('getDefaultValue', function () {

        it('should get the default value', function () {
            expect(bIS.getDefaultValue()).toBe('/client/images/logo.svg');
        });
    });

    describe('getEditPanels', function () {

        var contentElm, editPanels;
        beforeEach(function() {
            contentElm = $(imagePath, bannerItemElm);
            editPanels = bIS.getEditPanels($scope.model, contentElm, bannerItemElm, borders);
        });

        it('should have the proper amount of panels', function () {
            expect(editPanels.length).toBe(1);
        });

        it('should have the proper title attribute in the edit image layer', function () {
            expect(editPanels[0].title).toBe('Select media');
        });

        it('should have the proper src attribute in the edit image layer', function () {
            expect(editPanels[0].src).toBe('selectMedia');
        });

        it('should not have the appBridge attribute in the edit image layer', function () {
            expect(editPanels[0].appBridge).toBeUndefined();
        });

        it('should have the proper config attribute in the edit image layer', function () {
            expect(editPanels[0].config.editSize).toBeFalsy();
        });

        it('should have the proper onLayer attribute in the edit image layer', function () {
            expect(editPanels[0].onLayer.change).not.toBe(undefined);
        });
    });

    describe('onResizeItem', function () {

        var contentElm;
        beforeEach(function() {
            contentElm = $(imagePath, bannerItemElm);
        });

        it('should set the width of the given element to 100% (the same as the model says)', function () {
            bIS.onResizeItem(contentElm);
            expect(parseInt(contentElm.css('width'))).toBe($scope.model.size.width);
        });
    });

    function compile() {
        var template = '<div banner-item data="model" overflow="overflow" read-only="readOnly"></div>';
        bannerItemElm = $compile(template);
        $rootScope.$digest();
    }
});