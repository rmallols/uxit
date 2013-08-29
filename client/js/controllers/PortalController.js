//noinspection JSHint
function PortalController($scope, roleService, sessionService) {
    'use strict';
    $scope.isAdmin = function () {
        return roleService.hasAdminRole(sessionService.getUserSession());
    };
}