describe('roleService', function() {
    'use strict';

    var rS, cS, $httpBackend, sessionService;
    beforeEach( module("components"));
    beforeEach(inject(["$httpBackend", "roleService", "sessionService", "constantsService",
    function ($httpBackend_, roleService_, sessionService_, constantsService_) {
        $httpBackend    = $httpBackend_;
        sessionService  = sessionService_;
        rS = roleService_;
        cS = constantsService_;
        loadRoles($httpBackend, rS, null);
    }]));

    describe('getRoles', function() {
        it('should return the proper role karma', function() {
            var roles = rS.getRoles();
            expect(roles[0].karma).toBe(0);
            expect(roles[1].karma).toBe(1);
            expect(roles[2].karma).toBe(2);
            expect(roles[3].karma).toBe(3);
        });
        it('should return the proper role codes', function() {
            var roles = rS.getRoles();
            expect(roles[0].code).toBe(cS.roles.guest);
            expect(roles[1].code).toBe(cS.roles.reader);
            expect(roles[2].code).toBe(cS.roles.creator);
            expect(roles[3].code).toBe(cS.roles.admin);
        });
    });

    describe('getRole', function() {
        it('should return the guest role', function() {
            var role = rS.getRole(0);
            expect(role.karma).toBe(0);
            expect(role.code).toBe(cS.roles.guest);
        });
        it('should return the guest role', function() {
            var role = rS.getRole(1);
            expect(role.karma).toBe(1);
            expect(role.code).toBe(cS.roles.reader);
        });
        it('should return the guest role', function() {
            var role = rS.getRole(2);
            expect(role.karma).toBe(2);
            expect(role.code).toBe(cS.roles.creator);
        });
        it('should return the guest role', function() {
            var role = rS.getRole(3);
            expect(role.karma).toBe(3);
            expect(role.code).toBe(cS.roles.admin);
        });
    });

    describe('hasGuestRole', function() {
        it('should determine that non logged users doesn\'t have the guest role', function() {
            var user = null;
            expect(rS.hasGuestRole(user)).toBe(false);
        });
        it('should determine that users without role have the guest role', function() {
            var user = { role: null };
            expect(rS.hasGuestRole(user)).toBe(true);
        });
        it('should determine that guest users have the guest role', function() {
            var user = { role: 0 };
            expect(rS.hasGuestRole(user)).toBe(true);
        });
        it('should determine that reader users have the guest role', function() {
            var user = { role: 1 };
            expect(rS.hasGuestRole(user)).toBe(true);
        });
        it('should determine that creator users have the guest role', function() {
            var user = { role: 2 };
            expect(rS.hasGuestRole(user)).toBe(true);
        });
        it('should determine that admin users have the guest role', function() {
            var user = { role: 3 };
            expect(rS.hasGuestRole(user)).toBe(true);
        });
    });

    describe('hasReaderRole', function() {
        it('should determine that non logged users doesn\'t have the reader role', function() {
            var user = null;
            expect(rS.hasReaderRole(user)).toBe(false);
        });
        it('should determine that users without role doesn\'t have the reader role', function() {
            var user = { role: null };
            expect(rS.hasReaderRole(user)).toBe(false);
        });
        it('should determine that guest users doesn\'t have the reader role', function() {
            var user = { role: 0 };
            expect(rS.hasReaderRole(user)).toBe(false);
        });
        it('should determine that reader users have the reader role', function() {
            var user = { role: 1 };
            expect(rS.hasReaderRole(user)).toBe(true);
        });
        it('should determine that creator users have the reader role', function() {
            var user = { role: 2 };
            expect(rS.hasReaderRole(user)).toBe(true);
        });
        it('should determine that admin users have the reader role', function() {
            var user = { role: 3 };
            expect(rS.hasReaderRole(user)).toBe(true);
        });
    });

    describe('hasCreatorRole', function() {
        it('should determine that non logged users doesn\'t have the creator role', function() {
            var user = null;
            expect(rS.hasCreatorRole(user)).toBe(false);
        });
        it('should determine that users without role have the creator role', function() {
            var user = { role: null };
            expect(rS.hasCreatorRole(user)).toBe(false);
        });
        it('should determine that guest users doesn\'t have the creator role', function() {
            var user = { role: 0 };
            expect(rS.hasCreatorRole(user)).toBe(false);
        });
        it('should determine that reader users doesn\'t have the creator role', function() {
            var user = { role: 1 };
            expect(rS.hasCreatorRole(user)).toBe(false);
        });
        it('should determine that creator users have the creator role', function() {
            var user = { role: 2 };
            expect(rS.hasCreatorRole(user)).toBe(true);
        });
        it('should determine that admin users have the creator role', function() {
            var user = { role: 3 };
            expect(rS.hasCreatorRole(user)).toBe(true);
        });
    });

    describe('hasAdminRole', function() {
        it('should determine that non logged users doesn\'t have the admin role', function() {
            var user = null;
            expect(rS.hasAdminRole(user)).toBe(false);
        });
        it('should determine that users without role have the admin role', function() {
            var user = { role: null };
            expect(rS.hasAdminRole(user)).toBe(false);
        });
        it('should determine that guest users doesn\'t have the admin role', function() {
            var user = { role: 0 };
            expect(rS.hasAdminRole(user)).toBe(false);
        });
        it('should determine that reader users have the admin role', function() {
            var user = { role: 1 };
            expect(rS.hasAdminRole(user)).toBe(false);
        });
        it('should determine that creator users doesn\'t have the admin role', function() {
            var user = { role: 2 };
            expect(rS.hasAdminRole(user)).toBe(false);
        });
        it('should determine that admin users have the admin role', function() {
            var user = { role: 3 };
            expect(rS.hasAdminRole(user)).toBe(true);
        });
    });

    describe('getCurrentUserAdminAccessStyleClass', function() {

        it('should not retrieve any admin related class if the user doesn\'t have admin role', function() {
            loadUserSession($httpBackend, sessionService, false, null);
            expect(rS.getCurrentUserAdminAccessStyleClass()).toBe('');
        });

        it('should retrieve an admin related class if the user has admin role', function() {
            loadUserSession($httpBackend, sessionService, true, null);
            expect(rS.getCurrentUserAdminAccessStyleClass()).toBe('adminAccess');
        });
    });
});