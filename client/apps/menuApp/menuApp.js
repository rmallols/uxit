(function (COMPONENTS) {
    'use strict';
    COMPONENTS.directive('menuAppView', ['$rootScope', '$routeParams', 'pageService', 'constantsService',
    function ($rootScope, $routeParams, pageService, constantsService) {
        return {
            restrict: 'A',
            replace: true,
            templateUrl: 'menuAppView.html',
            scope: {},
            link: function link(scope) {

                scope.getPageUrl = function (page) {
                    return (page.type === constantsService.pageTypes.externalLink) ? page.externalLinkUrl : page.url;
                };

                scope.getPageTarget = function (page) {
                    return (page.type === constantsService.pageTypes.externalLink) ? page.target : '_self';
                };

                scope.getPageStyleClass = function (page) {
                    return ($routeParams.page.toLowerCase() === page.url.toLowerCase()) ? 'current' : '';
                };

                scope.isSubPageOf = function (subPage, page) { return pageService.isSubPageOf(subPage, page) };

                scope.hasSubPages = function (page) {
                    page.hasSubPages = false;
                    scope.pages.forEach(function (possibleSubPage) {
                        if (scope.isSubPageOf(possibleSubPage, page)) { page.hasSubPages = true; }
                    });
                    return page.hasSubPages;
                };

                $rootScope.$on(constantsService.collections.pages + 'Changed', function () {
                    scope.pages = pageService.getPages();
                });

                scope.pages = pageService.getPages();
            }
        };
    }]);
})(window.COMPONENTS);