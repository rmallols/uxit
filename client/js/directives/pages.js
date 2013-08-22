COMPONENTS.directive('pages', ['portalService', 'pageService', 'rowService', 'appService', 'userService', 'roleService', 'styleService',
function (portalService, pageService, rowService, appService, userService, roleService, styleService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: '/client/html/pages.html',
		link: function link(scope) {

            scope.portal = portalService.getPortal();

            scope.setPagesStyles = function () {
                if (scope.portal) {
                    return styleService.getNormalizedStyles(scope.portal.styles, null);
                }
                return null;
            };

            scope.getAdminAccessStyleClass = function () {
                return roleService.getAdminAccessStyleClass();
            };

            scope.isAdmin = function () { return roleService.hasAdminRole(userService.getCurrentUser()); };

            scope.isAppSortAllowed = function() {
                return isAppSortAndResizeAllowed();
            };

            scope.isAppResizeAllowed = function() {
                return isAppSortAndResizeAllowed();
            };

            /** Private methods **/
            function isAppSortAndResizeAllowed() {
                return scope.isAdmin() && !appService.isFullscreen();
            }
            /** End of private methods **/
		}
	};
}]);
