//noinspection JSHint
function LoginController($scope, $routeParams, globalMsgService) {
    'use strict';
    $scope.error = $routeParams.error;
    if ($routeParams.error) {
        //We need to execute the error handling in a new thread as the linking function
        //of the global message is executed AFTER the following code, so otherwise
        //it's still NOT subscribed to the show message event
        setTimeout(function () {
            globalMsgService.show('Invalid credentials');
            $scope.$apply();
        }, 100);

    }
}