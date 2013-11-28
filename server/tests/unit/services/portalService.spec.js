describe('portalService', function () {
    'use strict';
    var portal, portalService;
    beforeEach(module("components"));
    beforeEach(inject(["$httpBackend", "portalService", "pageService",
    function ($httpBackend, _portalService, pageService) {
        portalService  = _portalService;
        loadPages($httpBackend, pageService);
        loadPortal($httpBackend, portalService, function(loadedPortal) {
            portal = loadedPortal;
        });
    }]));

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