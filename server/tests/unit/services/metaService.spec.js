describe('metaService', function () {
    'use strict';

    var metaService, i18nService, setTitle;

    beforeEach(module("components"));
    beforeEach(inject(["$httpBackend", "metaService", "pageService", "i18nService",
    function ($httpBackend, _metaService, pageService, _i18nService) {
        metaService  = _metaService;
        i18nService = _i18nService;
        //setTitle = jasmine.createSpy('setTitle');
        loadPages($httpBackend, pageService, function() {
            pageService.setCurrentPage(pageService.getPages()[0]);
        });
    }]));

    describe('Page title', function () {

        it('should set a page title based on the provided token', function () {
            var currentPageTitle = 'This is a page title example';
            i18nService.changeLanguage('en');
            metaService.setHeader(currentPageTitle, null);
            expect(document.title).toBe('Home | ' + currentPageTitle);
        });
    });

    describe('Favicon', function () {

        it('should detect the default favicon url', function () {
            expect(metaService.getDefaultFaviconUrl()).toBe('/client/images/favicon.ico');
        });
    });

    describe('Window dimensions', function () {

        it('should get the proper window dimensions', function () {
            var windowDimensions;
            metaService.setWindowDimensions();
            windowDimensions = metaService.getWindowDimensions();
            expect(windowDimensions.width).toBe($(document).width());
            expect(windowDimensions.height).toBe($(document).height());
        });
    });
});