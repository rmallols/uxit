(function (window, angular) {
    'use strict';

    angular.module('errorModule', ['components']).config(['$httpProvider', '$provide',
    function ($httpProvider, $provide) {

        /* Client side error interceptor */
        $provide.provider('$exceptionHandler', function CustomExceptionHandlerProvider() {
            this.$get = ['stdService', function (stdService) {
                return function (exception) {
                    stdService.error(exception.message, exception.stack);
                };
            }];
        });

        /* HTTP error interceptor */
        $provide.factory('customHttpErrorInterceptor', ['stdService', 'globalMsgService', function customHttpErrorInterceptor(stdService, globalMsgService) {

            function success(response) {
                //globalMsgService.hide();
                return response;
            }

            function error(response) {
                stdService.error(response.data);
            }

            return function (promise) {
                return promise.then(success, error);
            };
        }]);

        $httpProvider.responseInterceptors.push('customHttpErrorInterceptor');
    }]);
})(window, window.angular);




