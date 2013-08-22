describe('portalService', function () {
    'use strict';
    var portal, portalService;
    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "portalService", function (_$rootScope, _portalService) {
        portalService  = _portalService;
        loadPortal(function(loadedPortal) {
            portal = loadedPortal;
        })
    }]));

    describe('Favicon', function () {
        it('should detect the default favicon url', function () {
            expect(portalService.getDefaultFaviconUrl()).toBe('/client/images/favicon.ico');
        });
    });

    describe('Fullscreen', function () {
        it('should detect the real fullscreen mode', function () {
            portal.fullscreenMode = 'real';
            expect(portalService.isRealFullscreen()).toBe(true);
            expect(portalService.isMaximizedFullscreen()).toBe(false);
            expect(portalService.isTemplateFullscreen()).toBe(false);
        });
        it('should detect the maximized fullscreen mode', function () {
            portal.fullscreenMode = 'maximized';
            expect(portalService.isRealFullscreen()).toBe(false);
            expect(portalService.isMaximizedFullscreen()).toBe(true);
            expect(portalService.isTemplateFullscreen()).toBe(false);
        });
        it('should detect the template fullscreen mode', function () {
            portal.fullscreenMode = 'template';
            expect(portalService.isRealFullscreen()).toBe(false);
            expect(portalService.isMaximizedFullscreen()).toBe(false);
            expect(portalService.isTemplateFullscreen()).toBe(true);
        });
    });
});