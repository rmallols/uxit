describe('bannerItem directive', function () {

    var $rootScope, $scope, $compile, $timeout, bannerItemDirective, model, template, sH;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", "$timeout", "stringService",
    function ($rootScope_, $compile_, $document_, $timeout_, stringService_) {
        template                = '<div banner-item data="model" overflow-visible="overflowVisible"></div>';
        model                   = {"id":1380531241893,"type":"text","value":"sample test","size":{"width":100,"height":100},"position":{"top":50,"left":300}};
        $rootScope              = $rootScope_;
        $scope                  = $rootScope.$new();
        $scope.model            = model;
        $scope.overflowVisible  = false;
        $compile                = compileFn($compile_, $scope, $document_);
        $timeout                = $timeout_;
        bannerItemDirective     = $compile(template);
        sH                      = stringService_;
        $rootScope.$digest();
    }]));

    describe('main DOM structure', function () {

        it('should wire the item Id with the Id attribute of the DOM', function () {
            var normalizedModelId  = model.id + ''; //Normalize the Id as string
            expect(bannerItemDirective.attr('id')).toBe(normalizedModelId);
        });

        it('should set the draggable main style class', function () {
            expect(bannerItemDirective.hasClass('ui-draggable')).toBe(true);
        });

        it('should set the resizable main style class', function () {
            expect(bannerItemDirective.hasClass('ui-resizable')).toBe(true);
        });

        it('should set the edit item button', function () {
            expect($('> button.edit[ng-click="editItem()"]', bannerItemDirective).length).toBe(1);
        });

        it('should set the select handler input to manage the active status', function () {
            var selectHandlerInputElm = $('input.selectHandler', bannerItemDirective);
            expect(selectHandlerInputElm.length).toBe(1);
        });
    });

    describe('item size', function () {

        it('should set the proper width', function () {
            expect(parseInt(bannerItemDirective.css('width'))).toBe(model.size.width);
        });

        it('should set the proper height', function () {
            expect(parseInt(bannerItemDirective.css('height'))).toBe(model.size.height);
        });
    });

    describe('item position', function () {

        it('should set the proper top position', function () {
            expect(parseInt(bannerItemDirective.css('top'))).toBe(model.position.top);
        });

        it('should set the proper left position', function () {
            expect(parseInt(bannerItemDirective.css('left'))).toBe(model.position.left);
        });
    });

    describe('item selection', function () {

        it('should not mark the item as selected by default', function () {
            expect(bannerItemDirective.hasClass('active')).toBe(false);
        });

        it('should mark the item as selected whenever it\'s clicked', function () {
            bannerItemDirective.click();
            expect(bannerItemDirective.hasClass('active')).toBe(true);
        });

        it('should unmark the item whenever it\'s blurred', function () {
            var selectHandlerInputElm = $('input.selectHandler', bannerItemDirective);
            bannerItemDirective.click();
            selectHandlerInputElm.blur();
            $timeout.flush();
            expect(bannerItemDirective.hasClass('active')).toBe(false);
        });
    });

    describe('text based item', function () {

        it('should add the text component', function () {
            expect($(' > .item.text', bannerItemDirective).length).toBe(1);
        });

        it('should set the specified text', function () {
            expect(sH.trim($(' > .item.text', bannerItemDirective).text())).toBe(model.value);
        });
    });

    describe('image based item', function () {

        it('should add the text component', function () {
            $scope.model.type   = 'image';
            bannerItemDirective = $compile(template);
            $rootScope.$digest();
            expect($(' > .item.text', bannerItemDirective).length).toBe(0);
            expect($(' > .item.image', bannerItemDirective).length).toBe(1);
        });

        it('should set the specified image source', function () {
            $scope.model.type   = 'image';
            $scope.model.value  = 'testImage.png';
            bannerItemDirective = $compile(template);
            $rootScope.$digest();
            expect($(' > .item.image', bannerItemDirective).attr('src')).toBe($scope.model.value);
        });
    });
});