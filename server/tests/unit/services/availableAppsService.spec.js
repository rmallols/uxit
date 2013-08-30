describe('availableAppsService', function() {
    'use strict';

    var aAS, availableApps, categories;
    beforeEach( module("components"));
    beforeEach(inject(["$httpBackend", "availableAppsService",
    function ($httpBackend, availableAppsService) {
        aAS = availableAppsService;
        loadAvailableApps($httpBackend, aAS, null);
        availableApps   = aAS.getAvailableApps();
        categories      = aAS.getCategories();
    }]));

    describe('getAvailableApps', function() {
        it('should return the proper size of available apps', function() {
            expect(availableApps.model.length).toBe(3);
        });
        it('should return the proper type of available apps', function() {
            expect(availableApps.model[0].id).toBe('loginApp');
            expect(availableApps.model[1].id).toBe('userListApp');
            expect(availableApps.model[2].id).toBe('bannerApp');
        });
    });

    describe('app categorization', function() {
        it('should register the first app attached to a category', function() {
            expect(availableApps.model[0].firstInCategory).toBe(true);
            expect(availableApps.model[1].firstInCategory).not.toBe(true);
            expect(availableApps.model[2].firstInCategory).toBe(true);
        });
    });

    describe('getCategories', function() {
        it('should get the proper category list', function() {
            expect(categories[availableApps.model[0].category]).toBe(true);
            expect(categories[availableApps.model[1].category]).toBe(true);
            expect(categories[availableApps.model[2].category]).toBe(true);
        });
    });
});