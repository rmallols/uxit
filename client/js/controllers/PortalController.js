//noinspection JSHint
function PortalController($scope, $rootScope, $routeParams, portalService, pageService, crudService, sessionService, userService,
                          roleService, domService, constantsService, stdService, i18nService) {
    'use strict';

    $scope.isAdmin = function () {
        return roleService.hasAdminRole(userService.getCurrentUser());
    };

    function getPortal(callback) {
        var bodyObj;
        if ($routeParams.portal) {
            bodyObj = $('body');
            domService.addLoadingFeedback(bodyObj);
            crudService.get(constantsService.collections.portal, $routeParams.portal, null, function (portalModel) {
                var pageModel = pageService.getPage($routeParams.page);
                domService.removeLoadingFeedback(bodyObj);
                if (!portalModel) {
                    stdService.error('The portal \"' + $routeParams.portal + '\" cannot be found');
                } else if (!pageModel) {
                    stdService.error('The page \"' + $routeParams.page + '\" cannot be found');
                } else {
                    $rootScope.portal = portalModel;
                    portalService.updatePageDataFromTemplate($rootScope.portal, pageModel.rows);
                    pageService.setCurrentPage(pageModel);
                    $rootScope.$broadcast('pageLoaded');
                    if (callback) { callback(); }
                }
            });
        }
    }

    $rootScope.portal = {};
    $rootScope.globalSettings = {};
    //Manually set the default status about showing the app headers
    $rootScope.globalSettings.showAppHeader = true;

    getPortal(function () {
        sessionService.loadUserSession(function (userSession) {
            if (userSession && userSession.language) {
                i18nService.changeLanguage(userSession.language);
            }
        });
        portalService.setHeader();
        portalService.setWindowDimensions();
        portalService.trackAnalytics();
    });
}