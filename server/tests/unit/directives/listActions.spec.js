describe('app directive', function () {

    var $rootScope, $scope, $compile, $httpBackend, listActionsDirective, roleService, sessionService,
        actionsPos, templateText;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$httpBackend", "roleService", "sessionService", "$timeout",
    function ($rootScope_, $compile_, $httpBackend_, roleService_, sessionService_, $timeout) {
        var template, listDirective;
        $rootScope      = $rootScope_;
        $httpBackend    = $httpBackend_;
        $scope          = $rootScope.$new();
        $compile        = compileFn($compile_, $scope);
        roleService     = roleService_;
        sessionService  = sessionService_;
        $scope.config   = {
            editable: true,
            selectable: true,
            multiSelectable: true
        };
        templateText    = 'This is the transcluded content';
        $scope.template = '<div>' + templateText + '</div>';
        actionsPos = {
            top: 0,
            bottom: 1,
            topAndBottom: 2
        };
        loadRoles($httpBackend, roleService, function(roleList) {
            $scope.roleList = roleList;
        });
        template      = '<div list="roleList" collection="collection" config="config" ' +
                        'transcluded-data="transcludedData" template="template" ' +
                        'on-edit-panels="onEditPanels" on-create="onCreate($item)" ' +
                        'on-delete="onDelete($id)"></div>';
        listDirective    = $compile(template, {});
        $rootScope.$digest();
        $timeout.flush();
        listActionsDirective = $('[list-actions]:first', listDirective);
    }]));

    describe('on select actions', function () {

        var onSelectActionsPath;
        beforeEach(function() {
            onSelectActionsPath = ' > .onSelectActions';
        });

        it('should not show the onSelect actions block by default (no items are selected', function () {
            expect(isVisible($(onSelectActionsPath, listActionsDirective))).toBe(false);
        });

        describe('select items button', function () {

            var selectItemsButtonPath;
            beforeEach(function() {
                selectItemsButtonPath = onSelectActionsPath + ' > button.okIcon';
            });

            it('should add a select items button', function () {
                expect($(selectItemsButtonPath, listActionsDirective).length).toBe(1);
            });

            it('should add a label to the select items button', function () {
                expect($(selectItemsButtonPath + ' > label', listActionsDirective).length).toBe(1);
            });

            it('should set the proper i18n tag to the label that is inside of the select items button', function () {
                expect($(selectItemsButtonPath + ' > label', listActionsDirective).attr('i18n')).toBe('list.selectItems');
            });
        });

        describe('delete items button', function () {

            var deleteItemsButtonPath;
            beforeEach(function() {
                deleteItemsButtonPath = onSelectActionsPath + ' > button.removeIcon';
            });

            it('should add a delete items button', function () {
                expect($(deleteItemsButtonPath, listActionsDirective).length).toBe(1);
            });

            it('should not show the delete items button by default (no items are selected)', function () {
                expect(isVisible($(deleteItemsButtonPath, listActionsDirective))).toBe(false);
            });

            it('should add a label to the delete items button', function () {
                expect($(deleteItemsButtonPath + ' > label', listActionsDirective).length).toBe(1);
            });

            it('should set the proper i18n tag to the label that is inside of the delete items button', function () {
                expect($(deleteItemsButtonPath + ' > label', listActionsDirective).attr('i18n')).toBe('list.deleteSelected');
            });
        });
    });

    describe('create actions', function () {

        var createActionsPath, createItemButtonPath;
        beforeEach(function() {
            createActionsPath = ' > .createActions';
            createItemButtonPath = createActionsPath + ' > button[create-item-button]';
        });

        it('should not show the create actions block by default', function () {
            expect(isVisible($(createActionsPath, listActionsDirective))).toBe(false);
        });

        it('should add a create item button', function () {
            expect($(createItemButtonPath, listActionsDirective).length).toBe(1);
        });

        it('should set the proper i18n tag to the label that is inside of the create item button', function () {
            expect($(createItemButtonPath + ' > label', listActionsDirective).attr('i18n')).toBe('list.createItem');
        });
    });

    describe('get page actions', function () {

        var getPageActionsPath, getPrevPageButtonPath, getNextPageButtonPath;
        beforeEach(function() {
            getPageActionsPath = ' > .getPageActions';
            getPrevPageButtonPath = getPageActionsPath + ' > .getPrevPage';
            getNextPageButtonPath = getPageActionsPath + ' > .getNextPage';
        });

        it('should not show the get page actions block by default', function () {
            expect(isVisible($(getPageActionsPath, listActionsDirective))).toBe(false);
        });

        it('should add a get prev page of items button', function () {
            expect($(getPrevPageButtonPath, listActionsDirective).length).toBe(1);
        });

        it('should add a get next page of items button', function () {
            expect($(getNextPageButtonPath, listActionsDirective).length).toBe(1);
        });
    });

    describe('selected items actions', function () {

        var selectedItemsPath;
        beforeEach(function() {
            selectedItemsPath = ' > .selectedItems';
        });

        it('should set the proper i18n tag to the label that is inside of the selected items block', function () {
            expect($(selectedItemsPath + ' > label > label', listActionsDirective).attr('i18n')).toBe('list.selectedItems');
        });
    });
});