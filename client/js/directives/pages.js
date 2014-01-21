COMPONENTS.directive('pages', ['$rootScope', 'portalService', 'pageService', 'rowService', 'appService', 'roleService', 'sessionService', 'styleService',
function ($rootScope, portalService, pageService, rowService, appService, roleService, sessionService, styleService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: 'pages.html',
		link: function link(scope) {

            var isAppBeingDragged = false;

            $rootScope.$on('portalLoaded', function() {
                scope.portal = portalService.getPortal();
            });

            scope.setPagesStyles = function () {
                if (scope.portal) {
                    return styleService.getNormalizedStyles(scope.portal.styles, null);
                }
                return null;
            };

            scope.getCurrentUserAdminAccessStyleClass = function () {
                return roleService.getCurrentUserAdminAccessStyleClass();
            };

            scope.isAdmin = function () { return roleService.hasAdminRole(sessionService.getUserSession()); };

            scope.isAppSortAllowed = function() {
                return isAppSortAndResizeAllowed();
            };

            scope.isAppResizeAllowed = function() {
                return isAppSortAndResizeAllowed();
            };

            $rootScope.$on('onStartDraggingNewApp', function() {
                console.log("START!");
                isAppBeingDragged = true;
                scope.$digest();

            });

            $rootScope.$on('onStopDraggingNewApp', function() {
                isAppBeingDragged = false;
                scope.$digest();
            });

            scope.getColSizeStyleClass = function(colSize, colIndex) {
                var colStyleClasses = {};
                if(!isAppBeingDragged) {
                    if(colSize === 1) {
                        colSize = 0;
                        colStyleClasses.showWhileDragging = true;
                    } else { colSize++; }
                    if(colIndex === 1) { colSize++; }
                }
                colStyleClasses['large-' + colSize] = true;
                return colStyleClasses;
            };

            /** Private methods **/
            function isAppSortAndResizeAllowed() {
                return scope.isAdmin() && !appService.isFullscreen();
            }
            /** End of private methods **/
		}
	};
}]);
