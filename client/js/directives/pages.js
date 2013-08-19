COMPONENTS.directive('pages', ['$rootScope', 'pageService', 'rowService', 'userService', 'roleService', 'styleService',
function ($rootScope, pageService, rowService, userService, roleService, styleService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: '/client/html/pages.html',
		link: function link(scope) {

            scope.setPagesStyles = function () {
                if (scope.$root.portal) {
                    return styleService.getNormalizedStyles($rootScope.portal.styles, null);
                }
                return null;
            };

            scope.getAdminAccessStyleClass = function () {
                return roleService.getAdminAccessStyleClass();
            };

            scope.isAdmin = function () { return roleService.hasAdminRole(userService.getCurrentUser()); };
		}
	};
}]);
