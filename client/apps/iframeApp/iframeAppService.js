(function () {
    'use strict';
    COMPONENTS.service('iframeAppService', [function () {

        function view(scope) {
        }

        function edit(scope) {
            //It's not a good idea to play directly with the model,
            //because as soon as the user will start to change the URL,
            //the iframe will be reloaded as well, probably blocking t
            //he browser after a few characters.
            //So, now we're cloning the model to play with the internal data object
            angular.extend(scope.internalData, scope.model);
        }

        function onEditSave(scope, callback) {
            //Once the user has finished with his changes, we update the model for the persistence
            angular.extend(scope.model, scope.internalData);
            callback();
        }

        return {
            view: view,
            edit: edit,
            onEditSave: onEditSave
        };
    }]);
})();
