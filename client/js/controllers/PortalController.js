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
                    $rootScope.portal.template.rows[1].columns[0].rows = pageModel.rows;
                    pageService.setCurrentPage(pageModel);
                    $rootScope.$broadcast('pageLoaded');
                    if (callback) { callback(); }
                }
            });
        }
    }

    function getUserSession(callback) {
        sessionService.getSession(function (user) {
            if (user) {
                $rootScope.portal.user = user;
            } else {
                $rootScope.portal.user = null;
            }
            if (callback) {
                callback(user);
            }
        });
    }

    $rootScope.portal = {};
    $rootScope.globalSettings = {};
    //Manually set the default status about showing the app headers
    $rootScope.globalSettings.showAppHeader = true;

    getPortal(function () {
        getUserSession(function (user) {
            if (user.language) {
                i18nService.changeLanguage(user.language);
            }
        });
        portalService.setHeader();
        portalService.setWindowDimensions();
        portalService.trackAnalytics();
    });
}