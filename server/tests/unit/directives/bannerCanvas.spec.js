describe('bannerCanvas directive', function () {

    var $rootScope, $scope, $compile, $httpBackend, sessionService, roleService, bannerCanvasDirective,
    gridSize = 20, model;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$httpBackend", "sessionService", "roleService",
    function ($rootScope_, $compile_, $httpBackend_, sessionService_, roleService_) {

        model           = [{"id":1380531241893,"type":"text","value":"sample test",
                            "size":{"width":40,"height":60}, "position":{"top":60,"left":80}}];
        $compile        = $compile_;
        $rootScope      = $rootScope_;
        $scope          = $rootScope.$new();
        $scope.model    = model;
        $scope.height   = 300;
        $scope.gridSize = gridSize;
        $httpBackend    = $httpBackend_;
        sessionService  = sessionService_;
        roleService     = roleService_;
        loadRoles($httpBackend, roleService, null);
        compile();
    }]));

    describe('main DOM structure', function () {

        it('should have the \'bannerCanvas\' styleclass', function () {
            expect(bannerCanvasDirective.hasClass('bannerCanvas')).toBe(true);
        });

        it('should have a grid container', function () {
            expect($(' > .grid', bannerCanvasDirective).length).toBe(1);
        });
    });

    describe('component editability', function () {

        describe('readonly style class', function () {

            it('should have the readonly class whenever the user doesn\'t have the creator role', function () {
                $rootScope.$digest();
                expect(bannerCanvasDirective.hasClass('readOnly')).toBe(true);
            });

            it('should have the readonly class whenever the user got the creator role after ' +
                'the element was created (for caching purposes)', function () {
                loadUserSession($httpBackend, sessionService, 2, null);
                expect(bannerCanvasDirective.hasClass('readOnly')).toBe(true);
            });

            it('should have the readonly class whenever the user has have the creator role before ' +
                'the element was created', function () {
                loadUserSession($httpBackend, sessionService, 2, null);
                compile();
                expect(bannerCanvasDirective.hasClass('readOnly')).toBe(false);
            });
        });

        describe('elements visibility', function () {

            it('should not have a global actions container without popper privileges', function () {
                expect($(' > .addArea', bannerCanvasDirective).length).toBe(0);
            });

            it('should have a global actions container with popper privileges', function () {
                loadUserSession($httpBackend, sessionService, 2, null);
                compile();
                expect($(' > .addArea', bannerCanvasDirective).length).toBe(1);
            });

            it('should have a button to add images without popper privileges', function () {
                var addImageSel = ' > .addArea > button.addImage[ng-click="addItem(\'image\')"]';
                expect($(addImageSel, bannerCanvasDirective).length).toBe(0);
            });

            it('should have a button to add images with popper privileges', function () {
                var addImageSel = ' > .addArea > button.addImage[ng-click="addItem(\'image\')"]';
                loadUserSession($httpBackend, sessionService, 2, null);
                compile();
                expect($(addImageSel, bannerCanvasDirective).length).toBe(1);
            });

            it('should not have a button to add text without popper privileges', function () {
                var addTextSel = ' > .addArea > button.addText[ng-click="addItem(\'text\')"]';
                expect($(addTextSel, bannerCanvasDirective).length).toBe(0);
            });

            it('should have a button to add text with popper privileges', function () {
                var addTextSel = ' > .addArea > button.addText[ng-click="addItem(\'text\')"]';
                loadUserSession($httpBackend, sessionService, 2, null);
                compile();
                expect($(addTextSel, bannerCanvasDirective).length).toBe(1);
            });
        });
    });

    describe('rulers structure', function () {

        it('should have the proper amount of column rulers', function () {
            $rootScope.$apply();
            $rootScope.$digest();
            var colRulersSize = Math.floor(100 / gridSize),
                colRulersElms = $(' > .grid > .ruler.col', bannerCanvasDirective);
            expect(colRulersSize).toBe(colRulersElms.length);
        });

        it('should have the proper amount of row rulers', function () {
            var rowRulersSize = Math.floor(100 / gridSize),
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

    function compile() {
        var template    = '<div banner-canvas ng-model="model" height="height" grid-size="gridSize" style="width: 100%; height: 320px;"></div>',
            compile     = compileFn($compile, $scope);
        bannerCanvasDirective = compile(template);
        $rootScope.$digest();
    }
});