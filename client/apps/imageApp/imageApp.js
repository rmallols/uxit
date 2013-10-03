COMPONENTS.directive('imageAppView', function (mediaService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: 'imageAppView.html',
        scope: {
            model: '=',
            internalData: '=',
            onLayerSave : '='
        },
        link: function link(scope) {

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
	};
});

COMPONENTS.directive('imageAppEdit', function () {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'imageAppEdit.html',
        scope: {
            model           : '=',
            internalData    : '=',
            onLayerSave     : '='
        },
        link: function link(scope) {

            scope.config = {
                selectable  : true,
                uploadable  : true,
                columns     : 2
            };

            scope.onSelect = function (media) {
                scope.model.mediaId = media._id;
                scope.internalData.media = media;
            };
        }
    };
});