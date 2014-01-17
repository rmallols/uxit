describe('bannerItem directive', function () {

    var $rootScope, $scope, $compile, $timeout, bannerItemElm, model, sH, textPath, imagePath,
        canvasPxWidth, canvasPxHeight;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", "$timeout", "stringService",
    function ($rootScope_, $compile_, $document_, $timeout_, stringService_) {
        model                   = {"id":1380531241893,"type":"text","value":"sample test",
                                   "size":{"width":40,"height":60},"position":{"top":20,"left":80}};
        $rootScope              = $rootScope_;
        $scope                  = $rootScope.$new();
        $scope.model            = model;
        $scope.overflow         = { visible: false };
        $scope.gridSize         = 20;
        $compile                = compileFn($compile_, $scope, $document_);
        $timeout                = $timeout_;
        sH                      = stringService_;
        canvasPxWidth           = 500;
        canvasPxHeight          = 300;
        textPath                = ' [ux-transclude] > .item.text';
        imagePath               = ' [ux-transclude] > .item.image';
        compile();
    }]));

    describe('main DOM structure', function () {

        it('should wire the item Id with the Id attribute of the DOM', function () {
            var normalizedModelId  = model.id + ''; //Normalize the Id as string
            expect(bannerItemElm.attr('id')).toBe(normalizedModelId);
        });

        it('should set the draggable main style class', function () {
            expect(bannerItemElm.hasClass('ui-draggable')).toBe(true);
        });

        it('should set the resizable main style class', function () {
            expect(bannerItemElm.hasClass('ui-resizable')).toBe(true);
        });

        it('should set the edit item button', function () {
            expect($('button.edit[ng-click="editItem()"]', bannerItemElm).length).toBe(1);
        });

        it('should set the select handler input to manage the active status', function () {
            var selectHandlerInputElm = $('input.selectHandler', bannerItemElm);
            expect(selectHandlerInputElm.length).toBe(1);
        });
    });

    describe('component editability', function () {

        describe('readOnly style class', function () {

            it('should not have the readonly class by default', function () {
                expect(bannerItemElm.hasClass('readOnly')).toBe(false);
            });

            it('should have the readonly class whenever the readonly attr is set', function () {
                $scope.readOnly = true;
                $rootScope.$digest();
                expect(bannerItemElm.hasClass('readOnly')).toBe(true);
            });
        });

        describe('draggable style class', function () {

            it('should have the ui-draggable class by default', function () {
                expect(bannerItemElm.hasClass('ui-draggable')).toBe(true);
            });

            it('should have the ui-draggable class even if the readonly attr is set after compilation ' +
            '(caching purposes)', function () {
                $scope.readOnly = true;
                $rootScope.$digest();
                expect(bannerItemElm.hasClass('ui-draggable')).toBe(true);
            });

            it('should not have the ui-draggable class if the readonly attr is set before compilation', function () {
                $scope.readOnly = true;
                compile();
                expect(bannerItemElm.hasClass('ui-draggable')).toBe(false);
            });
        });

        describe('resizable style class', function () {

            it('should have the ui-resizable class by default', function () {
                expect(bannerItemElm.hasClass('ui-resizable')).toBe(true);
            });

            it('should have the ui-resizable class even if the readonly attr is set after compilation ' +
            '(caching purposes)', function () {
                $scope.readOnly = true;
                $rootScope.$digest();
                expect(bannerItemElm.hasClass('ui-resizable')).toBe(true);
            });

            it('should not have the ui-resizable class if the readonly attr is set before compilation', function () {
                $scope.readOnly = true;
                compile();
                expect(bannerItemElm.hasClass('ui-resizable')).toBe(false);
            });
        });
    });

    describe('item size', function () {

        it('should set the proper width', function () {
            var itemWidth = Math.round(bannerItemElm.width() / bannerItemElm.parent().width() * 100);
            expect(itemWidth).toBe(model.size.width);

        });

        it('should set the proper height', function () {
            var itemHeight = Math.round(bannerItemElm.height() / bannerItemElm.parent().height() * 100);
            expect(itemHeight).toBe(model.size.height);
        });
    });

    describe('item position', function () {

        it('should set the proper top position', function () {
            var itemPxTop = (model.position.top / 100) * canvasPxHeight;
            expect(parseInt(bannerItemElm.css('top'))).toBe(itemPxTop);
        });

        it('should set the proper left position', function () {
            var itemPxLeft = (model.position.left / 100) * canvasPxWidth;
            expect(parseInt(bannerItemElm.css('left'))).toBe(itemPxLeft);
        });
    });

    describe('item selection', function () {

        it('should not mark the item as selected by default', function () {
            expect(bannerItemElm.hasClass('active')).toBe(false);
        });

        it('should mark the item as selected whenever it\'s clicked', function () {
            bannerItemElm.click();
            expect(bannerItemElm.hasClass('active')).toBe(true);
        });

        it('should unmark the item whenever it\'s blurred', function () {
            var selectHandlerInputElm = $('input.selectHandler', bannerItemElm);
            bannerItemElm.click();
            selectHandlerInputElm.blur();
            $timeout.flush();
            expect(bannerItemElm.hasClass('active')).toBe(false);
        });
    });

    describe('text based item', function () {

        it('should add the text component', function () {
            expect($(textPath, bannerItemElm).length).toBe(1);
        });

        it('should set the specified text', function () {
            expect(sH.trim($(textPath, bannerItemElm).text())).toBe(model.value);
        });
    });

    describe('image based item', function () {

        it('should add the text component', function () {
            $scope.model.type   = 'image';
            compile();
            expect($(textPath, bannerItemElm).length).toBe(0);
            expect($(imagePath, bannerItemElm).length).toBe(1);
        });

        it('should set the specified image source', function () {
            $scope.model.type   = 'image';
            $scope.model.value  = 'testImage.png';
            compile();
            expect($(imagePath, bannerItemElm).attr('src')).toBe($scope.model.value);
        });
    });

    function compile() {
        var bannerItemParentElm,
            template = '<div banner-item data="model" overflow="overflow" read-only="readOnly" grid-size="gridSize"></div>';
        bannerItemElm = $compile(template);
        //Mock the height of the parent element to ease height calculations of the item
        bannerItemParentElm = bannerItemElm.parent();
        bannerItemParentElm.width(canvasPxWidth);
        bannerItemParentElm.height(canvasPxHeight);
        $rootScope.$digest();
    }
});