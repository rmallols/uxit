var COMPONENTS = angular.module('components', []);
angular.module('app', ['templates-main', 'components', 'errorModule', 'ui.sortable']).config(['$locationProvider', '$routeProvider',
function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/error', {
            templateUrl: 'errorPage.html',
            controller:  ErrorController
        })
        .when('/:portal/login', {
            templateUrl: 'loginPage.html',
            controller:  LoginController
        })
        .when('/:portal/logout', { redirectTo: '/login' })
        .when('/:portal', {
            templateUrl: 'portalPage.html',
            controller: PortalController
        })
        .when('/:portal/:page', {
            templateUrl: 'portalPage.html',
            controller: PortalController,
            reloadOnSearch: false
        })
        .otherwise({ redirectTo: '/' });
}]).run(["$rootScope", "$routeParams", "$location", "portalService", "userService", "pageService", "roleService", "sessionService", "tagService",
    "availableAppsService", "i18nService", "metaService",
    function ($rootScope, $routeParams, $location, portalService, userService, pageService, roleService, sessionService,
    tagService, availableAppsService, i18nService, metaService) {

}]);
