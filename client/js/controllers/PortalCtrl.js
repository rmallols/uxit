COMPONENTS.controller('PortalCtrl', ['$scope', 'portalService', 'roleService', 'sessionService',
function($scope, portalService, roleService, sessionService) {
    'use strict';

    $scope.isAdmin = function () {
        return roleService.hasAdminRole(sessionService.getUserSession());
    };

    portalService.initializeResources();
}]);