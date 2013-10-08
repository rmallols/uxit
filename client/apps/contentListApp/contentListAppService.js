(function () {
    'use strict';
    COMPONENTS.service('contentListAppService', ['contentService', function (contentService) {

        function view(scope) {
        }

        function onAddSave(scope, callback) {
            contentService.createContent(scope.content, function () {
                callback();
            });
        }

        return {
            view: view,
            onAddSave: onAddSave
        };
    }]);
})();
