describe('bannerItem directive', function () {

    var $rootScope, $scope, $compile, bannerItemElm, bIS, model, textPath, borders, gridSize = 50;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", "bannerItemService",
    function ($rootScope_, $compile_, $document_, bannerItemService_) {
        model           = { "id":1380531241893,"type":"text","value":"sample test",
                            "size":{"width":100,"height":100},"position":{"top":50,"left":300}};
        $rootScope      = $rootScope_;
        $scope          = $rootScope.$new();
        $scope.model    = model;
        $scope.overflow = { visible: false };
        $compile        = compileFn($compile_, $scope, $document_);
        bIS             = bannerItemService_;
        textPath        = ' > [ux-transclude] > .item.text';
        borders         = { horizontal: 5, vertical: 10 };
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
            $scope.model.size.width = 50;
            bIS.setDomCoordinatesFromModel($scope.model, bannerItemElm, borders);
            expect(parseInt(bannerItemElm.css('width'), 10) + borders.horizontal).toBe($scope.model.size.width);
        });

        it('should update the height of the DOM element', function () {
            $scope.model.size.height = 50;
            bIS.setDomCoordinatesFromModel($scope.model, bannerItemElm, borders);
            expect(parseInt(bannerItemElm.css('height'), 10) + borders.vertical).toBe($scope.model.size.height);
        });

        it('should update the top position of the DOM element', function () {
            $scope.model.position.top = 100;
            bIS.setDomCoordinatesFromModel($scope.model, bannerItemElm, borders);
            expect(parseInt(bannerItemElm.css('top'), 10)).toBe($scope.model.position.top);
        });

        it('should update the left position of the DOM element', function () {
            $scope.model.position.left = 150;
            bIS.setDomCoordinatesFromModel($scope.model, bannerItemElm, borders);
            expect(parseInt(bannerItemElm.css('left'), 10)).toBe($scope.model.position.left);
        });
    });

    describe('setModelCoordinatesFromDom', function () {

        var contentElm;
        beforeEach(function() {
            contentElm = $(textPath, bannerItemElm);
        });

        it('should update the width of the model element', function () {
            var newWidth = 300;
            bannerItemElm.css('width', newWidth - borders.horizontal);
            bIS.setModelCoordinatesFromDom($scope.model, contentElm, bannerItemElm, borders, gridSize);
            expect($scope.model.size.width).toBe(newWidth);
        });

        it('should update the height of the model element', function () {
            var newHeight = 250;
            bannerItemElm.css('height', newHeight - borders.vertical);
            bIS.setModelCoordinatesFromDom($scope.model, contentElm, bannerItemElm, borders, gridSize);
            expect($scope.model.size.height).toBe(newHeight);
        });

        it('should update the top position of the model element', function () {
            var newTop = 400;
            bannerItemElm.css('top', newTop);
            bIS.setModelCoordinatesFromDom($scope.model, contentElm, bannerItemElm, borders, gridSize);
            expect($scope.model.position.top).toBe(newTop);
        });

        it('should update the left position of the model element', function () {
            var newLeft = 450;
            bannerItemElm.css('left', newLeft);
            bIS.setModelCoordinatesFromDom($scope.model, contentElm, bannerItemElm, borders, gridSize);
            expect($scope.model.position.left).toBe(newLeft);
        });
    });

    describe('refresh', function () {

        var contentElm;
        beforeEach(function() {
            contentElm = $(textPath, bannerItemElm);
        });

        it('should update the width of the DOM and the model element', function () {
            var newWidth = 100;
            bannerItemElm.css('width', newWidth - borders.horizontal);
            bIS.refresh($scope.model, contentElm, bannerItemElm, borders, gridSize);
            expect($scope.model.size.width).toBe(newWidth);
            expect(parseInt(bannerItemElm.css('width'), 10)).toBe(newWidth - borders.horizontal);
        });

        it('should update the height of the DOM and the model element', function () {
            var newHeight = 50;
            bannerItemElm.css('height', newHeight - borders.vertical);
            bIS.refresh($scope.model, contentElm, bannerItemElm, borders, gridSize);
            expect($scope.model.size.height).toBe(newHeight);
            expect(parseInt(bannerItemElm.css('height'), 10)).toBe(newHeight - borders.vertical);
        });

        it('should update the top position of the DOM and the model element', function () {
            var newTop = 150;
            bannerItemElm.css('top', newTop);
            bIS.refresh($scope.model, contentElm, bannerItemElm, borders, gridSize);
            expect($scope.model.position.top).toBe(newTop);
            expect(parseInt(bannerItemElm.css('top'), 10)).toBe(newTop);
        });

        it('should update the left position of the DOM and the model element', function () {
            var newLeft = 250;
            bannerItemElm.css('left', newLeft);
            bIS.refresh($scope.model, contentElm, bannerItemElm, borders, gridSize);
            expect($scope.model.position.left).toBe(newLeft);
            expect(parseInt(bannerItemElm.css('left'), 10)).toBe(newLeft);
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
        var template = '<div banner-item data="model" overflow="overflow" read-only="readOnly"></div>';
        bannerItemElm = $compile(template);
        $rootScope.$digest();
    }
});