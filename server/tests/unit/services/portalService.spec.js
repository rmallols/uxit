describe('portalService', function () {
    'use strict';
    var $rootScope, portalService;
    beforeEach(module("components"));
    beforeEach(inject(["$rootScope", "portalService", function (_$rootScope, _portalService) {
        $rootScope      = _$rootScope;
        portalService  = _portalService;
        loadPortal(function(portal) {
            $rootScope.portal = portal;
        })
    }]));

    describe('Favicon', function () {
        it('should detect the default favicon url', function () {
            expect(portalService.getDefaultFaviconUrl()).toBe('/client/images/favicon.ico');
        });
    });

    describe('Fullscreen', function () {
        it('should detect the real fullscreen mode', function () {
            $rootScope.portal.fullscreenMode = 'real';
            expect(portalService.isRealFullscreen()).toBe(true);
            expect(portalService.isMaximizedFullscreen()).toBe(false);
            expect(portalService.isTemplateFullscreen()).toBe(false);
        });
        it('should detect the maximized fullscreen mode', function () {
            $rootScope.portal.fullscreenMode = 'maximized';
            expect(portalService.isRealFullscreen()).toBe(false);
            expect(portalService.isMaximizedFullscreen()).toBe(true);
            expect(portalService.isTemplateFullscreen()).toBe(false);
        });
        it('should detect the template fullscreen mode', function () {
            $rootScope.portal.fullscreenMode = 'template';
            expect(portalService.isRealFullscreen()).toBe(false);
            expect(portalService.isMaximizedFullscreen()).toBe(false);
            expect(portalService.isTemplateFullscreen()).toBe(true);
        });
    });
});