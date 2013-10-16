describe('app header directive', function () {

    var $rootScope, $scope, $compile, $httpBackend, sessionService, roleService, headerElm, portalService;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$httpBackend", "portalService", "pageService",
    "roleService", "sessionService", "availableAppsService",
    function ($rootScope_, $compile_, $httpBackend_, portalService_, pageService_, roleService_,
    sessionService_, availableAppsService_) {
        $rootScope      = $rootScope_;
        $httpBackend    = $httpBackend_;
        $scope          = $rootScope.$new();
        $compile        = compileFn($compile_, $scope);
        sessionService  = sessionService_;
        roleService     = roleService_;
        portalService   = portalService_;
        loadRoles($httpBackend, roleService, null);
        loadPages($httpBackend_, pageService_);
        loadPortal($httpBackend_, portalService_, null);
        loadAvailableApps($httpBackend, availableAppsService_, null);
        headerElm = compile();
    }]));

    describe('general structure', function () {

        it('should have the micro clearfix styleclass', function () {
            expect(headerElm.hasClass('cf')).toBe(true);
        });
    });

    describe('header toggle structure', function () {

        it('should have header toggle element', function () {
            var headerToggleElm = $(' > .headerToggle', headerElm);
            expect(headerToggleElm.length).toBe(1);
        });

        it('should not show the header toggle if the user doesn\'t have the proper privileges', function () {
            var headerToggleElm = $(' > .headerToggle', headerElm);
            expect(isVisible(headerToggleElm)).toBe(false);
        });

        it('should not show the header toggle even if the user has the proper privileges' +
            'whenever they have been got dynamically (this is for caching pourposes)', function () {
            var headerToggleElm = $(' > .headerToggle', headerElm);
            loadUserSession($httpBackend, sessionService, 3, null);
            expect(isVisible(headerToggleElm)).toBe(false);
        });

        it('should show the header toggle if the user had the proper privileges before compilation', function () {
            var headerElm, headerToggleElm;
            loadUserSession($httpBackend, sessionService, 3, null);
            headerElm = compile();
            headerToggleElm = $(' > .headerToggle', headerElm);
            expect(isVisible(headerToggleElm)).toBe(true);
        });
    });

    describe('header area structure', function () {

        it('should have header area element', function () {
            var headerAreaElm = $(' > .header', headerElm);
            expect(headerAreaElm.length).toBe(1);
        });

        it('should have the micro clearfix styleclass', function () {
            var headerAreaElm = $(' > .header', headerElm);
            expect(headerAreaElm.hasClass('cf')).toBe(true);
        });

        it('should not show the header area if the user doesn\'t have the proper privileges', function () {
            var headerAreaElm = $(' > .header', headerElm);
            expect(isVisible(headerAreaElm)).toBe(false);
        });

        it('should not show the header area even if the user has the proper privileges' +
            'whenever they have been got dynamically (this is for caching pourposes)', function () {
            var headerAreaElm = $(' > .header', headerElm);
            loadUserSession($httpBackend, sessionService, 3, null);
            expect(isVisible(headerAreaElm)).toBe(false);
        });

        it('should show the header toggle if the user had the proper privileges before compilation', function () {
            var headerElm, headerAreaElm;
            loadUserSession($httpBackend, sessionService, 3, null);
            headerElm = compile();
            headerAreaElm = $(' > .header', headerElm);
            expect(isVisible(headerAreaElm)).toBe(true);
        });
    });

    describe('header area title', function () {

        it('should have the title element', function () {
            var titleElm = $(' > .header > .title', headerElm);
            expect(titleElm.length).toBe(1);
        });

        it('should take the app default title if the model doesn\'t specify a new one', function () {
            var titleElm = $(' > .header > .title', headerElm);
            expect(trim(titleElm.text())).toBe('Login form');
        });

        it('should take the specific title if the model specifies it', function () {
            var titleElm = $(' > .header > .title', headerElm);
            $scope.model.title = 'Custom title';
            $rootScope.$digest();
            expect(trim(titleElm.text())).toBe($scope.model.title);
        });
    });

    describe('actions', function () {

        it('should have the actions element', function () {
            var actionsElm = $(' > .header > .actions', headerElm);
            expect(actionsElm.length).toBe(1);
        });

        describe('edit', function () {

            it('should have the edit action element', function () {
                var editActionElm = $(' > .header > .actions > .editIcon', headerElm);
                expect(editActionElm.length).toBe(1);
            });

            it('should not show the edit action by default', function () {
                var editActionElm = $(' > .header > .actions > .editIcon', headerElm);
                expect(isVisible(editActionElm)).toBe(false);
            });

            it('should show the edit action whenever the use has the proper privileges ' +
            'before compiling', function () {
                var editActionElm;
                loadUserSession($httpBackend, sessionService, 2, null);
                headerElm = compile();
                editActionElm = $(' > .header > .actions > .editIcon', headerElm);
                expect(isVisible(editActionElm)).toBe(true);
            });
        });

        describe('fullscreen', function () {

            it('should have the fullscreen action element', function () {
                var fullscreenActionElm = $(' > .header > .actions > .fullscreenIcon', headerElm);
                expect(fullscreenActionElm.length).toBe(1);
            });

            it('should not show the fullscreen action by default', function () {
                var fullscreenActionElm = $(' > .header > .actions > .fullscreenIcon', headerElm);
                expect(isVisible(fullscreenActionElm)).toBe(false);
            });

            it('should not show the fullscreen action whenever the use has\'nt the proper privileges ' +
                'before compiling (i.e. he\'s creator but not admin user', function () {
                var fullscreenActionElm;
                loadUserSession($httpBackend, sessionService, 2, null);
                headerElm = compile();
                fullscreenActionElm = $(' > .header > .actions > .fullscreenIcon', headerElm);
                expect(isVisible(fullscreenActionElm)).toBe(false);
            });

            it('should show the fullscreen action whenever the use has the proper privileges ' +
                'before compiling', function () {
                var fullscreenActionElm;
                loadUserSession($httpBackend, sessionService, 3, null);
                headerElm = compile();
                fullscreenActionElm = $(' > .header > .actions > .fullscreenIcon', headerElm);
                expect(isVisible(fullscreenActionElm)).toBe(true);
            });

            describe('disabled state', function () {

                it('should not mark the fullscreen action as disabled if fullscreen mode ' +
                'is not template and the app doesn\' belong to the template area', function () {
                    var headerElm, portal, fullscreenActionElm;
                    loadUserSession($httpBackend, sessionService, 3, null);
                    portal = portalService.getPortal();
                    portal.fullscreenMode = 'maximized';
                    headerElm = compile({ template: false });
                    fullscreenActionElm = $(' > .header > .actions > .fullscreenIcon', headerElm);
                    expect(fullscreenActionElm.attr('disabled')).toBe(undefined);
                });

                it('should not mark the fullscreen action as disabled if fullscreen mode ' +
                'is template but the app doesn\' belong to the template area', function () {
                    var headerElm, portal, fullscreenActionElm;
                    loadUserSession($httpBackend, sessionService, 3, null);
                    portal = portalService.getPortal();
                    portal.fullscreenMode = 'template';
                    headerElm = compile({ template: false });
                    fullscreenActionElm = $(' > .header > .actions > .fullscreenIcon', headerElm);
                    expect(fullscreenActionElm.attr('disabled')).toBe(undefined);
                });

                it('should not mark the fullscreen action as disabled if fullscreen mode ' +
                    'is not template and the app belongs to the template area', function () {
                    var headerElm, portal, fullscreenActionElm;
                    loadUserSession($httpBackend, sessionService, 3, null);
                    portal = portalService.getPortal();
                    portal.fullscreenMode = 'maximized';
                    headerElm = compile({ template: true });
                    fullscreenActionElm = $(' > .header > .actions > .fullscreenIcon', headerElm);
                    expect(fullscreenActionElm.attr('disabled')).toBe(undefined);
                });

                it('should mark the fullscreen action as disabled if fullscreen mode ' +
                    'is template and the app belongs to the template area', function () {
                    var headerElm, portal, fullscreenActionElm;
                    loadUserSession($httpBackend, sessionService, 3, null);
                    portal = portalService.getPortal();
                    portal.fullscreenMode = 'template';
                    headerElm = compile({ template: true });
                    fullscreenActionElm = $(' > .header > .actions > .fullscreenIcon', headerElm);
                    expect(fullscreenActionElm.attr('disabled')).toBe('disabled');
                });
            });
        });

        describe('remove', function () {

            it('should have the remove action element', function () {
                var removeActionElm = $(' > .header > .actions > .removeIcon', headerElm);
                expect(removeActionElm.length).toBe(1);
            });

            it('should not show the remove action by default', function () {
                var removeActionElm = $(' > .header > .actions > .removeIcon', headerElm);
                expect(isVisible(removeActionElm)).toBe(false);
            });

            it('should show the remove action whenever the use has the proper privileges ' +
                'before compiling', function () {
                var removeActionElm;
                loadUserSession($httpBackend, sessionService, 3, null);
                headerElm = compile();
                removeActionElm = $(' > .header > .actions > .removeIcon', headerElm);
                expect(isVisible(removeActionElm)).toBe(true);
            });
        });
    });

    function compile(customData) {
        var template, data, appDirective;
        data = {
            type    : 'loginApp',
            size    : 25,
            template: true,
            model   : {
                showTitle   : false
            }
        };
        angular.extend(data, customData);
        template    = '<li app model="model" type="type" template-app="' + data.template + '" width="size"></li>';
        appDirective = $compile(template, data);
        $rootScope.$digest();
        return $(' > [app-header]', appDirective);
    }
});