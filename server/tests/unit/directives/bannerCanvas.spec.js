describe('bannerCanvas directive', function () {

    var $rootScope, $scope, $compile, bannerCanvasDirective, gridSize = 50, model;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", function ($rootScope_, $compile_, $document_) {
        var template            = '<div banner-canvas ng-model="model" style="height: 320px;"></div>';
        model                   = [{"id":1380531241893,"type":"text","value":"sample test","size":{"width":100,"height":100},"position":{"top":50,"left":300}}];
        $rootScope              = $rootScope_;
        $scope                  = $rootScope.$new();
        $scope.model            = model;
        $compile                = compileFn($compile_, $scope, $document_);
        bannerCanvasDirective   = $compile(template);
        $rootScope.$digest();
    }]));

    describe('main DOM structure', function () {

        it('should have the \'bannerCanvas\' styleclass', function () {
            expect(bannerCanvasDirective.hasClass('bannerCanvas')).toBe(true);
        });

        it('should have a button to add images', function () {
            expect($(' > button.addImage[ng-click="addImage()"]', bannerCanvasDirective).length).toBe(1);
        });

        it('should have a button to add text', function () {
            expect($(' > button.addText[ng-click="addText()"]', bannerCanvasDirective).length).toBe(1);
        });

        it('should have a grid container', function () {
            expect($(' > .grid', bannerCanvasDirective).length).toBe(1);
        });
    });

    describe('rulers structure', function () {

        it('should have the proper amount of column rulers', function () {
            var colRulersSize = Math.floor(bannerCanvasDirective.width() / gridSize),
                colRulersElms = $(' > .grid > .ruler.col', bannerCanvasDirective);
            expect(colRulersSize).toBe(colRulersElms.length);
        });

        it('should have the proper amount of row rulers', function () {
            var rowRulersSize = Math.floor(bannerCanvasDirective.height() / gridSize),
                rowRulersElms = $(' > .grid > .ruler.row', bannerCanvasDirective);
            expect(rowRulersSize).toBe(rowRulersElms.length);
        });
    });

    describe('initial model state', function () {

        it('should have the proper amount of added items', function () {
            var bannerItemElms = $(' > .grid > [banner-item]', bannerCanvasDirective);
            expect(bannerItemElms.length).toBe(model.length);
        });
    });
});