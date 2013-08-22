//noinspection JSHint
function PortalController($scope, userService, roleService) {
    'use strict';
    $scope.isAdmin = function () {
        return roleService.hasAdminRole(userService.getCurrentUser());
    };
}