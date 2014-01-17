describe('bannerItem directive', function () {
    'use strict';
    var $rootScope, $scope, $compile, bannerItemElm, bIS, model, textPath, gridSize = 20, bCDimensions;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", "bannerItemService",
    function ($rootScope_, $compile_, $document_, bannerItemService_) {
        model           = { "id":1380531241893,"type":"text","value":"sample test",
                            "size":{"width":60,"height":40},"position":{"top":20,"left":80}};
        $rootScope      = $rootScope_;
        $scope          = $rootScope.$new();
        $scope.model    = model;
        $scope.overflow = { visible: false };
        $compile        = compileFn($compile_, $scope, $document_);
        bIS             = bannerItemService_;
        bCDimensions    = { width: 500, height: 300 };
        textPath        = ' [ux-transclude] > .item.text';
        compile();
    }]));

    describe('getTypeService', function () {

        it('should get the text service', function () {
            expect(bIS.getTypeService('text')).not.toBe(undefined);
        });

        it('should get the image service', function () {
            expect(bIS.getTypeService('image')).not.toBe(undefined);
        });
    });

    describe('setDomCoordinatesFromModel', function () {

        it('should update the width of the DOM element', function () {
            var bannerItemPxWidth;
            $scope.model.size.width = 40;
            bIS.setDomCoordinatesFromModel($scope.model, bannerItemElm);
            bannerItemPxWidth = ($scope.model.size.width / 100) * bCDimensions.width;
            expect(parseInt(bannerItemElm.css('width'), 10)).toBe(bannerItemPxWidth);
        });

        it('should update the height of the DOM element', function () {
            var bannerItemPxHeight;
            $scope.model.size.height = 60;
            bIS.setDomCoordinatesFromModel($scope.model, bannerItemElm);
            bannerItemPxHeight = ($scope.model.size.height / 100) * bCDimensions.height;
            expect(parseInt(bannerItemElm.css('height'), 10)).toBe(bannerItemPxHeight);
        });

        it('should update the top position of the DOM element', function () {
            var bannerItemPxTop;
            $scope.model.position.top = 40;
            bIS.setDomCoordinatesFromModel($scope.model, bannerItemElm);
            bannerItemPxTop = ($scope.model.position.top / 100) * bCDimensions.height;
            expect(parseInt(bannerItemElm.css('top'), 10)).toBe(bannerItemPxTop);
        });

        it('should update the left position of the DOM element', function () {
            var bannerItemPxLeft;
            $scope.model.position.left = 60;
            bIS.setDomCoordinatesFromModel($scope.model, bannerItemElm);
            bannerItemPxLeft = ($scope.model.position.left / 100) * bCDimensions.width;
            expect(parseInt(bannerItemElm.css('left'), 10)).toBe(bannerItemPxLeft);
        });
    });

    describe('setModelCoordinatesFromDom', function () {

        var contentElm;
        beforeEach(function() {
            contentElm = $(textPath, bannerItemElm);
        });

        it('should update the width of the model element', function () {
            var newPxWidth = 300, newWidth = Math.round((newPxWidth / bCDimensions.width) * 100);
            bannerItemElm.css('width', newPxWidth);
            bIS.setModelCoordinatesFromDom($scope.model, contentElm, bannerItemElm, gridSize, bCDimensions);
            expect($scope.model.size.width).toBe(newWidth);

        });

        it('should update the height of the model element', function () {
            var newPxHeight = 240, newHeight = Math.round((newPxHeight / bCDimensions.height) * 100);
            bannerItemElm.css('height', newPxHeight);
            bIS.setModelCoordinatesFromDom($scope.model, contentElm, bannerItemElm, gridSize, bCDimensions);
            expect($scope.model.size.height).toBe(newHeight);
        });

       it('should update the top position of the model element', function () {
            var newPxTop = 80, expectedNewTop = 40;
            bannerItemElm.css('top', newPxTop);
            bIS.setModelCoordinatesFromDom($scope.model, contentElm, bannerItemElm, gridSize, bCDimensions);
            //80px means 27% of the canvas height (300px) this means the final top will be 40%
            //as this has be normalized in order to bound to the grid (it's by default, actually)
            expect($scope.model.position.top).toBe(expectedNewTop);
        });

        it('should update the left position of the model element', function () {
            var newPxLeft = 280, expectedNewLeft = 60;
            bannerItemElm.css('left', newPxLeft);
            bIS.setModelCoordinatesFromDom($scope.model, contentElm, bannerItemElm, gridSize, bCDimensions);
            //80px means 56% of the canvas width (500px) this means the final top will be 60%
            //as this has be normalized in order to bound to the grid
            expect($scope.model.position.left).toBe(expectedNewLeft);
        });
    });

    describe('refresh', function () {

        var contentElm;
        beforeEach(function() {
            contentElm = $(textPath, bannerItemElm);
        });

        it('should update the width of the DOM and the model element', function () {
            var newPxWidth      = 240,
                expectedWidth   = 60,
                expectedPxWidth = (expectedWidth / 100) * bCDimensions.width;
            bannerItemElm.css('width', newPxWidth);
            bIS.refresh($scope.model, contentElm, bannerItemElm, gridSize, bCDimensions);
            //240px means 48% of the canvas width (500px) this means the final width will be 60%
            //as this has be normalized in order to bound to the grid
            expect($scope.model.size.width).toBe(expectedWidth);
            expect(parseInt(bannerItemElm.css('width'), 10)).toBe(expectedPxWidth);
        });

        it('should update the height of the DOM and the model element', function () {
            var newPxHeight         = 80,
                expectedHeight      = 40,
                expectedPxHeight    = (expectedHeight / 100) * bCDimensions.height;
            bannerItemElm.css('height', newPxHeight);
            bIS.refresh($scope.model, contentElm, bannerItemElm, gridSize, bCDimensions);
            //80px means 26% of the canvas height (300px) this means the final height will be 40%
            //as this has be normalized in order to bound to the grid
            expect($scope.model.size.height).toBe(expectedHeight);
            expect(parseInt(bannerItemElm.css('height'), 10)).toBe(expectedPxHeight);
        });

        it('should update the top position of the DOM and the model element', function () {
            var newPxTop    = 120,
                expectedTop = 40;
            bannerItemElm.css('top', newPxTop);
            bIS.refresh($scope.model, contentElm, bannerItemElm, gridSize, bCDimensions);
            //120px means 40% of the canvas height (300px) this means the final top will be 40%
            //as this has be normalized in order to bound to the grid (it's by default, actually)
            expect($scope.model.position.top).toBe(expectedTop);
            expect(parseInt(bannerItemElm.css('top'), 10)).toBe(newPxTop);
        });

        it('should update the left position of the DOM and the model element', function () {
            var newPxLeft       = 220,
                expectedLeft    = 60,
                expectedPxLeft  = (expectedLeft / 100) * bCDimensions.width;
            bannerItemElm.css('left', newPxLeft);
            bIS.refresh($scope.model, contentElm, bannerItemElm, gridSize, bCDimensions);
            //220px means 44% of the canvas width (500px) this means the final left will be 60%
            //as this has be normalized in order to bound to the grid
            expect($scope.model.position.left).toBe(expectedLeft);
            expect(parseInt(bannerItemElm.css('left'), 10)).toBe(expectedPxLeft);
        });
    });

    describe('propagateChanges', function () {

        it('should execute the given callback function', function () {
            var callbackFns = {
                propagateChanges: function() {}
            };
            spyOn(callbackFns, 'propagateChanges');
            bIS.propagateChanges(callbackFns.propagateChanges);
            expect(callbackFns.propagateChanges).toHaveBeenCalledOnce();

        });
    });

    function compile() {
        var bannerItemParentElm,
            template = '<div banner-item data="model" overflow="overflow" read-only="readOnly"></div>';
        bannerItemElm = $compile(template);
        //Mock the height of the parent element to ease height calculations of the item
        bannerItemParentElm = bannerItemElm.parent();
        bannerItemParentElm.width(bCDimensions.width);
        bannerItemParentElm.height(bCDimensions.height);
        $rootScope.$digest();
    }
});