describe('bannerItem directive', function () {

    var $rootScope, $scope, $compile, bannerItemElm, bTS, i18nS, model, textPath, borders;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$document", "bannerTextService",
    function ($rootScope_, $compile_, $document_, bannerTextService_) {
        model           = { "id":1380531241893,"type":"text","value":"sample test",
                            "size":{"width":100,"height":100},"position":{"top":50,"left":300}};
        $rootScope      = $rootScope_;
        $scope          = $rootScope.$new();
        $scope.model    = model;
        $scope.overflow = { visible: false };
        $compile        = compileFn($compile_, $scope, $document_);
        bTS             = bannerTextService_;
        textPath        = ' > [ux-transclude] > .item.text';
        borders         = { horizontal: 5, vertical: 10 };
        compile();
    }]));

    describe('getTemplate', function () {

        it('should have a div root element', function () {
            expect($(bTS.getTemplate()).is('div')).toBe(true);
        });

        it('should have a label element as the child of the root one', function () {
            expect($(' > label', bTS.getTemplate()).length).toBe(1);
        });

        it('should have a i18n setup in the label element of the child of the root one', function () {
            expect($(' > label', bTS.getTemplate()).attr('i18n-db')).toBe('item.value');
        });
    });


    describe('getDefaultValue', function () {

        it('should get the default value', function () {
            expect(bTS.getDefaultValue()).toBe('menzit portal!');
        });
    });

    describe('getEditPanels', function () {

        var contentElm, editPanels;
        beforeEach(function() {
            contentElm = $(textPath, bannerItemElm);
            editPanels = bTS.getEditPanels($scope.model, contentElm, bannerItemElm, borders);
        });

        it('should have the proper amount of panels', function () {
            expect(editPanels.length).toBe(1);
        });

        it('should have the proper title attribute in the edit text layer', function () {
            expect(editPanels[0].title).toBe('Content');
        });

        it('should have the appBridge attribute in the edit text layer', function () {
            expect(editPanels[0].appBridge).toBe(true);
        });

        it('should have the proper src attribute in the edit text layer', function () {
            expect(editPanels[0].src).toBe('bannerText');
        });

        it('should have the proper view attribute in the edit text layer', function () {
            expect(editPanels[0].view).toBe('editText');
        });

        it('should have the proper binding attribute in the edit text layer', function () {
            expect(editPanels[0].bindings.item.id).toBe($scope.model.id);
        });

        it('should have the proper onLayer attribute in the edit text layer', function () {
            expect(editPanels[0].onLayer.change).not.toBe(undefined);
        });
    });

    describe('editText', function () {

        it('should have call the change event whenever the content changes', function () {
            bTS.editText($scope);
            $scope.onLayer = {
                change: function() {}
            };
            spyOn($scope.onLayer, 'change');
            $scope.contentChanged();
            expect($scope.onLayer.change).toHaveBeenCalledOnce();
        });
    });

    function compile() {
        var template = '<div banner-item data="model" overflow="overflow" read-only="readOnly"></div>';
        bannerItemElm = $compile(template);
        $rootScope.$digest();
    }
});