COMPONENTS.controller('LoginCtrl', ['$scope', '$routeParams', 'globalMsgService',
function($scope, $routeParams, globalMsgService) {
    'use strict';
    $scope.error = $routeParams.error;
    if ($routeParams.error) {
        globalMsgService.show('Invalid credentials');
    }
}]);