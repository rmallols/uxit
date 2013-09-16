//noinspection JSHint
function ErrorController($scope, $routeParams, i18nService) {
    'use strict';

    $scope.errorTitle = i18nService($routeParams.title, $routeParams.targetId);
    $scope.showPortalHomeButton = $routeParams.showPortalHomeButton === 'true';

    $scope.goToPortalHome = function() {
        location.href = $routeParams.portalId;
    };
}