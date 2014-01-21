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
                isAppBeingDragged = true;
                scope.$digest();

            });

            $rootScope.$on('onStopDraggingNewApp', function() {
                isAppBeingDragged = false;
                scope.$digest();
            });

            scope.getColStyleClass = function(col, index, isTemplate) {
                var colStyleClasses = {}, colSize;
                if(isTemplate) {
                    if(col.apps)    { colStyleClasses.template = true; }
                    else            { colStyleClasses.pageWrapper = true; }
                }
                colSize = getFinalColSize(col.size, index, colStyleClasses.pageWrapper, col.apps);
                colStyleClasses['large-' + colSize] = true;
                return colStyleClasses;
            };

            /** Private methods **/
            function getFinalColSize(originalColSize, colIndex, isPageWrapper, colApps) {
                var colSize = originalColSize;
                if(!isAppBeingDragged) {  //If an app is being sorted, finalColSize = originalColSize
                    if(!isPageWrapper && !colApps.length)   { colSize = 0; } //Hide empty cols
                    else                                    { colSize++; }
                    //Increase the first one to fit all the available space
                    if(colIndex === 1)                      { colSize++; }
                }
                return colSize;
           }


            function isAppSortAndResizeAllowed() {
                return scope.isAdmin() && !appService.isFullscreen();
            }
            /** End of private methods **/
		}
	};
}]);
