//noinspection JSHint
COMPONENTS.controller('ErrorCtrl', ['$scope', '$routeParams', 'i18nService',
function($scope, $routeParams, i18nService) {
    'use strict';
    $scope.errorTitle = i18nService($routeParams.title, $routeParams.targetId);
    $scope.showPortalHomeButton = $routeParams.showPortalHomeButton === 'true';
    $scope.goToPortalHome = function() {
        location.href = $routeParams.portalId;
    };
}]);