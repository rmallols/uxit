COMPONENTS.directive('editCurrentUser', ['$rootScope', 'userService', 'sessionService',
function ($rootScope, userService, sessionService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: '/client/html/admin/editCurrentUser.html',
        scope: {
            model: '=',
            onLayerSave: '='
        },
        link: function link(scope) {

            scope.currentUser = $rootScope.portal.user;

            scope.onLayerSave = function (callback) {
                userService.updateUser(scope.currentUser, function () {
                    callback();
                });
            };

            scope.logout = function () {
                sessionService.logout();
            };
        }
    };
}]);