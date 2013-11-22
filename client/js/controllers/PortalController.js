//noinspection JSHint
function PortalController($scope, $routeParams, portalService, roleService, sessionService,
                          userService, pageService, tagService, i18nService, availableAppsService,
                          metaService) {
    'use strict';
    $scope.isAdmin = function () {
        return roleService.hasAdminRole(sessionService.getUserSession());
    };

    userService.loadUsers(null);    //Cache users
    pageService.loadPages(null);    //Cache pages
    roleService.loadRoles(function() {
        tagService.loadTags(null);      //Cache tags
        i18nService.loadLanguages(null);//Cache languages
        availableAppsService.loadAvailableApps(null); //Cache available apps
        sessionService.loadUserSession(function (userSession) {
            if (userSession && userSession.language) {
                i18nService.changeLanguage(userSession.language);
            }
        });
        portalService.loadPortal($routeParams.page, function() {
            portalService.setHeader();
            metaService.setWindowDimensions();
            portalService.trackAnalytics();
        });
    });    //Cache roles
}