//noinspection JSHint
function PortalController($scope, roleService, sessionService) {
    'use strict';
    $scope.isAdmin = function () {
        return roleService.hasAdminRole(sessionService.getUserSession());
    };

    //Hay que crear una nueva directiva, tipo confirm="Are you sure?<button ng-click="..."></button>"


    $scope.bla = 'test value2';

    $scope.bindedMethod = function(item) {
        console.log("DELETED!!!", item);
    };
}