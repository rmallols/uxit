(function (angular) {
    'use strict';

    COMPONENTS.directive('iframeAppView', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                model : '=',
                internalData : '=',
                onLayerSave : '='
            },
            templateUrl: '/client/apps/iframeApp/iframeAppView.html'
        };
    }]);

    COMPONENTS.directive('iframeAppEdit', [function () {
        return {
            restrict: 'A',
            replace: true,
            scope: {
                model : '=',
                internalData : '=',
                onLayerSave : '='
            },
            templateUrl: '/client/apps/iframeApp/iframeAppEdit.html',
            link: function link(scope) {
                //It's not a good idea to play directly with the model, because as soon as the user will start
                //to change the URL, the iframe will be reloaded as well, probably blocking the browser
                //after a few characters. So, now we're cloning the model to play with the internal data object
                angular.extend(scope.internalData, scope.model);
                scope.onLayerSave = function (callback) {
                    //Once the user has finsihed with his changes, we update the model for the persistence
                    angular.extend(scope.model, scope.internalData);
                    callback();
                };
            }
        };
    }]);
})(window.angular);