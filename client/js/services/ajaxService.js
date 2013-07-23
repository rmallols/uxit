(function () {
    'use strict';

    COMPONENTS.factory('ajaxService', ['$http', function ($http) {

        /**
         * Executes an ajax request to the backend
         *
         * @param {object} options The options for the request setup (url, method, data...)
         */
        function ajax(options) {
            var settings = {
                url: options.url,
                method: options.method || 'GET',
                data: (options) ? options.data : {}
            };
            //Normalize the URL if the parameters are going to be sent as query string
            if (settings.data && settings.method === 'GET') {
                settings.url = settings.url + '?' + decodeURIComponent($.param(settings.data)); //JSON -> query string
            }
            $http(settings).success(
            function (data/*, status, headers, config*/) {
                if (options.success) {
                    options.success(data);
                }
            }).error(function (data/*, status, headers, config*/) {
                if (options.error) {
                    options.error(data);
                }
            });
        }

        return {
            ajax: ajax
        };
    }]);
})();
