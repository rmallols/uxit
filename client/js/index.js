var COMPONENTS = angular.module('components', []);
angular.module('app', ['components', 'errorModule', 'ui.sortable']).config(['$locationProvider', '$routeProvider',
function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/login', {
            templateUrl: '/client/html/pages/login.html',
            controller:  LoginController
        })
        .when('/logout', { redirectTo: '/login' })
        .when('/:portal/logout', { redirectTo: '/login' })
        .when('/:portal', {
            templateUrl: '/client/html/pages/portal.html',
            controller: PortalController
        })
        .when('/:portal/:page', {
            templateUrl: '/client/html/pages/portal.html',
            controller: PortalController,
            reloadOnSearch: false
        })
        .otherwise({ redirectTo: '/' });
}]).run(["$rootScope", "$location", "userService", "pageService", "roleService", "tagService", "availableAppsService", "i18nService",
    function ($rootScope, $location, userService, pageService, roleService, tagService, availableAppsService, i18nService) {
        userService.loadUsers(null);    //Cache users
        pageService.loadPages(null);    //Cache pages
        roleService.loadRoles(null);    //Cache roles
        tagService.loadTags(null);      //Cache tags
        i18nService.loadLanguages(null);//Cache languages
        availableAppsService.loadAvailableApps(null); //Cache available apps
        $rootScope.$on("$routeChangeSuccess", function () {});
}]);
