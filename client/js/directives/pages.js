COMPONENTS.directive('pages', ['$rootScope', 'pageService', 'rowService', 'userService', 'roleService', 'styleService',
function ($rootScope, pageService, rowService, userService, roleService, styleService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: '/client/html/pages.html',
		link: function link(scope) {

            $rootScope.$on('pageLoaded', function () {
                scope.page = pageService.getCurrentPage();

                /*$rootScope.total = {};
                $rootScope.total.rows = [
                        {
                            columns: [
                                {
                                    size: 1,
                                    apps: []
                                },
                                {
                                    size: 23,
                                    apps: [{
                                        type: 'languageSelectApp'
                                    }]
                                },
                                {
                                    size: 1,
                                    apps: []
                                }
                            ]
                        },
                        {
                            columns: [
                                {
                                    size: 25,
                                    pageWrapper: true,
                                    rows: scope.page.rows
                                }
                            ]
                        },
                        {
                            columns: [
                                {
                                    size: 1,
                                    apps: []
                                },
                                {
                                    size: 23,
                                    apps: [{
                                        type: 'loginApp'
                                    }]
                                },
                                {
                                    size: 1,
                                    apps: []
                                }
                            ]
                        }
                    ];*/
            });

            scope.setPagesStyles = function () {
                if (scope.$root.portal) {
                    return styleService.getNormalizedStyles($rootScope.portal.styles);
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
