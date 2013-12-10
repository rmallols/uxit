(function() {
    'use strict';
    window.COMPONENTS = angular.module('components', []);

    angular.module('app', ['templates-main', 'components', 'errorModule', 'ui.sortable', 'ui.date'])
        .config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
            $locationProvider.html5Mode(true);
            $routeProvider
                .when('/error', {
                    templateUrl: 'errorPage.html',
                    controller:  'ErrorCtrl'
                })
                .when('/:portal/login', {
                    templateUrl: 'loginPage.html',
                    controller:  'LoginCtrl'
                })
                .when('/:portal/logout', { redirectTo: '/login' })
                .when('/:portal', {
                    templateUrl: 'portalPage.html',
                    controller: 'PortalCtrl'
                })
                .when('/:portal/:page', {
                    templateUrl: 'portalPage.html',
                    controller: 'PortalCtrl',
                    reloadOnSearch: false
                })
                .otherwise({ redirectTo: '/' });
        }]).run(['$rootScope', '$location', 'globalMsgService',
        function ($rootScope, $location, globalMsgService) {
            $rootScope.$on("$routeChangeSuccess", function() {
                var searchParams = $location.search();
                if(searchParams.message) {
                    globalMsgService.show(searchParams.message, searchParams.desc, searchParams.type);
                }
            });
        }]);
}());

