(function () {
    'use strict';
    COMPONENTS.service('mediaListAppService', ['mediaService', function (mediaService) {

        function view(scope) {
        }

        function onEditSave(scope, callback) {
            mediaService.createMedia(scope.media, function () {
                callback();
            });
        }

        return {
            view: view,
            onEditSave: onEditSave
        };
    }]);
})();
