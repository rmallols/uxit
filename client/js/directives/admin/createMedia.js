COMPONENTS.directive('createMedia', ['tagService', function (tagService) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'createMedia.html',
        scope : {
            media : '=model'
        },
        link: function link(scope) {

            scope.multipleFilesUploaded = false;
            scope.media = [];
            scope.availableTags = tagService.getTags();

            scope.onUpload = function (uploadedMedia) {
                scope.multipleFilesUploaded = uploadedMedia.length > 1;
                scope.media = uploadedMedia;
            };

            scope.getMultipleFilesUploadedNames = function () {
                var multipleFilesUploadedNames = '';
                if (scope.multipleFilesUploaded) {
                    scope.media.forEach(function (media) {
                        multipleFilesUploadedNames += media.name + ', ';
                    });
                }
                return multipleFilesUploadedNames;
            };
        }
    };
}]);