(function () {
    'use strict';
    COMPONENTS.service('imageAppService', ['mediaService', function (mediaService) {

        function view(scope) {

            if (scope.model.mediaId) {
                mediaService.getMedia(scope.model.mediaId, null, function (media) {
                    scope.internalData.media = media;
                });
            }

            scope.getDownloadUrl = function () {
                if (scope.internalData.media) {
                    return mediaService.getDownloadUrl(scope.internalData.media);
                }
                return null;
            };

            scope.getMediaTitle = function () {
                //return scope.internalData.media.name;
                return (scope.internalData.media) ? mediaService.getMediaHtmlDetails(scope.internalData.media) : '';
            }
        }

        function edit(scope) {
            scope.config = {
                selectable  : true,
                uploadable  : true,
                columns     : 2
            };
            console.log("HERE IS", scope.config);
            scope.onSelect = function (media) {
                scope.model.mediaId = media._id;
                scope.internalData.media = media;
            };
        }

        return {
            view: view,
            edit: edit
        };
    }]);
})();
