describe('app directive', function () {

    var $rootScope, $scope, $compile, $httpBackend, appDirective, data, sessionService, roleService;

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$httpBackend", "portalService", "pageService", "roleService", "sessionService", "availableAppsService",
    function ($rootScope_, $compile_, $httpBackend_, portalService_, pageService_, roleService_, sessionService_, availableAppsService_) {
        var template;
        $rootScope      = $rootScope_;
        $httpBackend    = $httpBackend_;
        $scope          = $rootScope.$new();
        $compile        = compileFn($compile_, $scope);
        sessionService  = sessionService_;
        roleService     = roleService_;
        loadRoles($httpBackend, roleService, null);
        loadPages($httpBackend_, pageService_);
        loadPortal($httpBackend_, portalService_, null);
        loadAvailableApps($httpBackend, availableAppsService_, null);
        data = {
            type    : 'loginApp',
            size    : 25,
            model   : {
                showTitle : false
            }
        };
        template        = '<li app model="model" type="type" template-app="true" width="size"></li>';
        appDirective    = $compile(template, data);
        $rootScope.$digest();
    }]));

    describe('root element', function () {

        it('should have the app generic style class', function () {
            expect(appDirective.hasClass('app')).toBe(true);
        });

        it('should have the app specific style class', function () {
            expect(appDirective.hasClass(data.type)).toBe(true);
        });

        it('should have the clearfix style class', function () {
            expect(appDirective.hasClass('cf')).toBe(true);
        });

        it('should not have any admin related class by default', function () {
            expect(appDirective.hasClass('adminAccess')).toBe(false);
        });

        it('should have an admin related class if the user has the proper privileges', function () {
            loadUserSession($httpBackend, sessionService, true, null);
            expect(appDirective.hasClass('adminAccess')).toBe(true);
        });
    });

    describe('header area', function () {

        it('should have the reference to the app header directive', function () {
            expect($(' > [app-header]', appDirective).length).toBe(1);
        });

        it('should have the clearfix style class in the reference to the app header directive', function () {
            expect($(' > [app-header].cf', appDirective).length).toBe(1);
        });
    });

    describe('content area', function () {

        it('should have the reference to the content area', function () {
            expect($(' > .content', appDirective).length).toBe(1);
        });

        it('should have the clearfix style class in the reference to the content area', function () {
            expect($(' > .content.cf', appDirective).length).toBe(1);
        });
    });

    describe('content area - app bridge', function () {

        var appBridgeSelector = ' > .content > [app-bridge]';
        it('should have a reference to the app bridge area', function () {
            expect($(appBridgeSelector, appDirective).length).toBe(1);
        });

        it('should specify the model attribute', function () {
            expect($(appBridgeSelector, appDirective).attr('model')).toBe('model');
        });

        it('should specify the internal data attribute', function () {
            expect($(appBridgeSelector, appDirective).attr('internal-data')).toBe('internalData');
        });

        it('should specify the src attribute', function () {
            expect($(appBridgeSelector, appDirective).attr('src')).toBe('loginApp');
        });

        it('should specify the view attribute', function () {
            expect($(appBridgeSelector, appDirective).attr('view')).toBe('view');
        });

        it('should specify the onEvent attribute', function () {
            expect($(appBridgeSelector, appDirective).attr('on-event')).toBe('onEvent');
        });
    });

    describe('content area - title handling', function () {

        it('should have a reference to the title area in the reference to the content area', function () {
            expect($(' > .content > .title', appDirective).length).toBe(1);
        });

        it('should have a reference to the title type area in the reference to the content area', function () {
            expect($(' > .content > .title > h5', appDirective).length).toBe(1);
        });

        it('should not show the title area by default', function () {
            expect(isVisible($(' > .content > .title', appDirective))).toBe(false);
        });

        it('should show the title area if it\'s the model says that', function () {
            data.model.showTitle = true;
            $rootScope.$digest();
            expect(isVisible($(' > .content > .title', appDirective))).toBe(true);
        });

        it('should show the default app title if the app is not specifying a specific one', function () {
            data.model.showTitle = true;
            $rootScope.$digest();
            expect($(' > .content > .title', appDirective).text()).toBe('Login form');
        });

        it('should show the specific app title if the app overwrites it', function () {
            data.model.showTitle = true;
            data.model.title = 'This is a specific title';
            $rootScope.$digest();
            expect($(' > .content > .title', appDirective).text()).toBe(data.model.title);
        });
    });
});