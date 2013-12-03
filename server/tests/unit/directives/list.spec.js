describe('app directive', function () {

    var $rootScope, $scope, $compile, $httpBackend, listDirective, roleService, sessionService,
        actionsPos, templateText;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$httpBackend", "roleService", "sessionService",
    function ($rootScope_, $compile_, $httpBackend_, roleService_, sessionService_) {
        var template;
        $rootScope      = $rootScope_;
        $httpBackend    = $httpBackend_;
        $scope          = $rootScope.$new();
        $compile        = compileFn($compile_, $scope);
        roleService     = roleService_;
        sessionService  = sessionService_;
        $scope.config   = {};
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
        template        =   '<div list="roleList" collection="collection" config="config" ' +
                            'transcluded-data="transcludedData" template="template" ' +
                            'on-edit-panels="onEditPanels" on-create="onCreate($item)" ' +
                            'on-delete="onDelete($id)"></div>';
        listDirective    = $compile(template, {});
        $rootScope.$digest();
    }]));

    describe('items size', function () {

        it('should not show the \'no items\' block if there\'re available content to show', function () {
            expect($('.noItems', listDirective).is(':visible')).toBe(false);
        });

        it('should add to the DOM the proper amount of items', function () {
            expect($('.item.columns', listDirective).length).toBe($scope.roleList.length);
        });
    });

    describe('search', function () {

        it('should show the search area by default', function () {
            expect(isVisible($('.searchArea', listDirective))).toBe(true);
        });

        it('should show the search area if it has been explicitly marked as visible', function () {
            $scope.config.searchable = true;
            $rootScope.$digest();
            expect(isVisible($('.searchArea', listDirective))).toBe(true);
        });

        it('should not show the search area if it has been explicitly marked as invisible', function () {
            $scope.config.searchable = false;
            $rootScope.$digest();
            expect(isVisible($('.searchArea', listDirective))).toBe(false);
        });
    });

    describe('actions position', function () {

        describe('top', function () {

            it('should show the actions area on top by default', function () {
                expect(isVisible($('[list-actions].top', listDirective))).toBe(true);
            });

            it('should show the actions area on top if it has been explicitly defined (top)', function () {
                $scope.config.pageActionPos = actionsPos.top;
                $rootScope.$digest();
                expect(isVisible($('[list-actions].top', listDirective))).toBe(true);
            });

            it('should show the actions area on top if it has been explicitly defined (top and bottom)', function () {
                $scope.config.pageActionPos = actionsPos.topAndBottom;
                $rootScope.$digest();
                expect(isVisible($('[list-actions].top', listDirective))).toBe(true);
            });

            it('should not show the actions area on top if it has been explicitly defined (bottom)', function () {
                $scope.config.pageActionPos = actionsPos.bottom;
                $rootScope.$digest();
                expect(isVisible($('[list-actions].top', listDirective))).toBe(false);
            });
        });

        describe('bottom', function () {

            it('should show the actions area on bottom by default', function () {
                expect(isVisible($('[list-actions].bottom', listDirective))).toBe(true);
            });

            it('should show the actions area on bottom if it has been explicitly defined (bottom)', function () {
                $scope.config.pageActionPos = actionsPos.bottom;
                $rootScope.$digest();
                expect(isVisible($('[list-actions].bottom', listDirective))).toBe(true);
            });

            it('should show the actions area on bottom if it has been explicitly defined (top and bottom)', function () {
                $scope.config.pageActionPos = actionsPos.topAndBottom;
                $rootScope.$digest();
                expect(isVisible($('[list-actions].bottom', listDirective))).toBe(true);
            });

            it('should not show the actions area on top if it has been explicitly defined (top)', function () {
                $scope.config.pageActionPos = actionsPos.top;
                $rootScope.$digest();
                expect(isVisible($('[list-actions].bottom', listDirective))).toBe(false);
            });
        });
    });

    describe('item selection', function () {

        it('should not show the checkbox selector by default', function () {
            expect(isVisible($('.selectFromCheckbox', listDirective))).toBe(false);
        });

        it('should not show the checkbox selector if selection mode is set to single', function () {
            $scope.config.selectable = true;
            $rootScope.$digest();
            expect(isVisible($('.selectFromCheckbox', listDirective))).toBe(false);
        });

        it('should not show the checkbox selector if selection mode is set to multiple' +
        'but the user doesn\'t have the proper privileges', function () {
            $scope.config.multiSelectable = true;
            $rootScope.$digest();
            expect(isVisible($('.selectFromCheckbox', listDirective))).toBe(false);
        });

        it('should not show the checkbox selector if selection mode is set to multiple' +
        'and the user has the proper privileges', function () {
            $scope.config.selectable = false;
            $scope.config.multiSelectable = true;
            $rootScope.$digest();
            loadUserSession($httpBackend, sessionService, 3, null);
            expect(isVisible($('.selectFromCheckbox', listDirective))).toBe(true);
        });
    });

    describe('item deletion', function () {

        it('should not show the item remove button by default', function () {
            expect(isVisible($('button.remove', listDirective))).toBe(false);
        });

        it('should not show the item remove button if the deletable flag is set to false', function () {
            $scope.config.deletable = false;
            $rootScope.$digest();
            expect(isVisible($('button.remove', listDirective))).toBe(false);
        });

        it('should not show the item remove button if the deletable flag is set to true' +
        'but the user doesn\'t have the proper privileges', function () {
            $scope.config.deletable = true;
            $rootScope.$digest();
            expect(isVisible($('button.remove', listDirective))).toBe(false);
        });

        it('should show the item remove button if the deletable flag is set to true' +
        'and the user has the proper privileges', function () {
            $scope.config.deletable = true;
            $rootScope.$digest();
            loadUserSession($httpBackend, sessionService, 3, null);
            expect(isVisible($('button.remove', listDirective))).toBe(true);
        });
    });

    describe('content transclussion', function () {

        it('should add the transcluded content defined in the template', function () {
            expect($('[ux-transclude="template"]:first', listDirective).text()).toBe(templateText);
        });
    });

    describe('detailId area', function () {

        it('should not show the detailId area by default', function () {
            expect(isVisible($('.detailArea', listDirective))).toBe(false);
        });
    });
});