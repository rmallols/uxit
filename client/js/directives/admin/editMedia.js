COMPONENTS.directive('editMedia', ['mediaService', 'tagService', function (mediaService, tagService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: 'editMedia.html',
        scope: {
            media       : '=model',
            onLayerSave : '='
        },
		link: function link(scope) {
            scope.availableTags = tagService.getTags();
            scope.onLayerSave = function (callback) {
                mediaService.updateMedia(scope.media, function () {
                    callback();
                });
            };
            scope.onUpload = function (uploadedMedia) {
                //For any unknown reason, the uploaded media preview is not updated till the model changes
                //(executing a $apply is not enough). Due to that, it's necessary to force the document name change somehow
                scope.media.name = '';
                setTimeout(function () {
                    scope.media.name = uploadedMedia[0].name;
                    scope.$apply();
                }, 0);
            };
		}
	};
}]);
