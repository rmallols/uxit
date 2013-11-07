describe('app service', function () {

    var appService, appDirective, data, portal, fullScreenSuffix = 'Fullscreen',
        realFullscreenTag = 'real', maximizedFullscreenTag = 'maximized', templateFullscreenTag = 'template';

    beforeEach(module('components', 'templates-main', 'mocks.$timeout'));
    beforeEach(inject(["$rootScope", "$compile", "$httpBackend", "appService", "portalService", "pageService",
    function ($rootScope_, $compile_, $httpBackend_, appService_, portalService_, pageService_) {
        var template, compile, scope;
        scope           = $rootScope_.$new();
        compile         = compileFn($compile_, scope);
        appService      = appService_;
        loadPages($httpBackend_, pageService_);
        loadPortal($httpBackend_, portalService_, function(loadedPortal) {
            portal = loadedPortal;
        });
        data = {
            type    : 'loginApp',
            size    : 25,
            model   : {
                showTitle : false
            }
        };
        template        = '<li app model="model" type="type" template-app="true" width="size"></li>';
        appDirective    = compile(template, data);
        $rootScope_.$digest();
    }]));

    describe('enableFullscreen', function () {

        it('should not add any fullscreen style class by default', function () {
            expect(appDirective.hasClass(realFullscreenTag + fullScreenSuffix)).toBe(false);
            expect(appDirective.hasClass(maximizedFullscreenTag + fullScreenSuffix)).toBe(false);
            expect(appDirective.hasClass(templateFullscreenTag + fullScreenSuffix)).toBe(false);
        });

        it('should add the real fullscreen style class whenever this is the active mode', function () {
            portal.fullscreenMode = realFullscreenTag;
            appService.enableFullscreen(appDirective, 0, data.size, null);
            expect(appDirective.hasClass(realFullscreenTag + fullScreenSuffix)).toBe(true);
            expect(appDirective.hasClass(maximizedFullscreenTag + fullScreenSuffix)).toBe(false);
            expect(appDirective.hasClass(templateFullscreenTag + fullScreenSuffix)).toBe(false);
        });

        it('should add the maximized fullscreen style class whenever this is the active mode', function () {
            portal.fullscreenMode = maximizedFullscreenTag;
            appService.enableFullscreen(appDirective, 0, data.size, null);
            expect(appDirective.hasClass(realFullscreenTag + fullScreenSuffix)).toBe(false);
            expect(appDirective.hasClass(maximizedFullscreenTag + fullScreenSuffix)).toBe(true);
            expect(appDirective.hasClass(templateFullscreenTag + fullScreenSuffix)).toBe(false);
        });

        it('should add the template fullscreen style class whenever this is the active mode', function () {
            portal.fullscreenMode = templateFullscreenTag;
            appService.enableFullscreen(appDirective, 0, data.size, null);
            expect(appDirective.hasClass(realFullscreenTag + fullScreenSuffix)).toBe(false);
            expect(appDirective.hasClass(maximizedFullscreenTag + fullScreenSuffix)).toBe(false);
            expect(appDirective.hasClass(templateFullscreenTag + fullScreenSuffix)).toBe(true);
        });
    });

    describe('disableFullscreen', function () {

        it('should remove the real fullscreen style class whenever this is the active mode ' +
        'but is disabled afterwards', function () {
            portal.fullscreenMode = realFullscreenTag;
            appService.enableFullscreen(appDirective, 0, data.size, null);
            appService.disableFullscreen(appDirective, null);
            expect(appDirective.hasClass(realFullscreenTag + fullScreenSuffix)).toBe(false);
            expect(appDirective.hasClass(maximizedFullscreenTag + fullScreenSuffix)).toBe(false);
            expect(appDirective.hasClass(templateFullscreenTag + fullScreenSuffix)).toBe(false);
        });

        it('should remove the maximized fullscreen style class whenever this is the active mode ' +
            'but is disabled afterwards', function () {
            portal.fullscreenMode = maximizedFullscreenTag;
            appService.enableFullscreen(appDirective, 0, data.size, null);
            appService.disableFullscreen(appDirective, null);
            expect(appDirective.hasClass(realFullscreenTag + fullScreenSuffix)).toBe(false);
            expect(appDirective.hasClass(maximizedFullscreenTag + fullScreenSuffix)).toBe(false);
            expect(appDirective.hasClass(templateFullscreenTag + fullScreenSuffix)).toBe(false);
        });

        it('should remove the template fullscreen style class whenever this is the active mode ' +
            'but is disabled afterwards', function () {
            portal.fullscreenMode = templateFullscreenTag;
            appService.enableFullscreen(appDirective, 0, data.size, null);
            appService.disableFullscreen(appDirective, null);
            expect(appDirective.hasClass(realFullscreenTag + fullScreenSuffix)).toBe(false);
            expect(appDirective.hasClass(maximizedFullscreenTag + fullScreenSuffix)).toBe(false);
            expect(appDirective.hasClass(templateFullscreenTag + fullScreenSuffix)).toBe(false);
        });
    });

    describe('isFullscreen', function () {

        it('should return false if the fullscreen is not enabled', function () {
            expect(appService.isFullscreen()).toBe(false);
        });

        it('should return true if the real fullscreen is enabled', function () {
            portal.fullscreenMode = realFullscreenTag;
            appService.enableFullscreen(appDirective, 0, data.size, null);
            expect(appService.isFullscreen()).toBe(true);
            appService.disableFullscreen(appDirective, null);
            expect(appService.isFullscreen()).toBe(false);
        });

        it('should return true if the maximized fullscreen is enabled', function () {
            portal.fullscreenMode = maximizedFullscreenTag;
            appService.enableFullscreen(appDirective, 0, data.size, null);
            expect(appService.isFullscreen()).toBe(true);
            appService.disableFullscreen(appDirective, null);
            expect(appService.isFullscreen()).toBe(false);
        });

        it('should return true if the template fullscreen is enabled', function () {
            portal.fullscreenMode = templateFullscreenTag;
            appService.enableFullscreen(appDirective, 0, data.size, null);
            expect(appService.isFullscreen()).toBe(true);
            appService.disableFullscreen(appDirective, null);
            expect(appService.isFullscreen()).toBe(false);
        });
    });

    describe('getAppRootElem', function () {

        it('should return the pointer to the root element of an app - direct child', function () {
            var childElem   = $('[app-header]', appDirective),
                rootElem    = appService.getAppRootElem(childElem);
            expect(rootElem.hasClass(data.type)).toBe(true);
        });

        it('should return the pointer to the root element of an app - non direct child', function () {
            var childElem   = $('.removeIcon', appDirective),
                rootElem    = appService.getAppRootElem(childElem);
            expect(rootElem.hasClass(data.type)).toBe(true);
        });

        it('should not return the pointer to the root element of an app - element dont\'t exist', function () {
            var childElem   = $('.fake-selector', appDirective),
                rootElem    = appService.getAppRootElem(childElem);
            expect(rootElem.length).toBe(0);
        });
    });
});