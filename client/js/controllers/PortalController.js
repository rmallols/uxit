//noinspection JSHint
function PortalController($scope, roleService, sessionService, tooltipService, $compile) {
    'use strict';
    $scope.isAdmin = function () {
        return roleService.hasAdminRole(sessionService.getUserSession());
    };

    //Hay que crear una nueva directiva, tipo confirm="Are you sure?<button ng-click="..."></button>"


    $scope.bla = 'test value2';
    $scope.test = 'MSure?!!!';
    $scope.showConfirm = false;

    $scope.confirmDelete = function() {
        $scope.showConfirm = true;
    };

    $scope.bindedMethod = function() {
        console.log("DELETED!!!");
    };
}