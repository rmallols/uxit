COMPONENTS.directive('fileUploader', ['mediaService', 'arrayService', 'stdService',
function (mediaService, arrayService, stdService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
		templateUrl: '/client/html/input/fileUploader.html',
        scope: {
            model           : '=ngModel',
            endpoint        : '@',
            onUpload        : '=',
            defaultMediaUrl : '=',
            preview         : '@'
        },
		link: function link(scope, element) {

            scope.getDownloadUrl = function (file) {
                //If an array is passed (multiple files were uploaded) just display the first one
                if (arrayService.isArray(file)) {
                    file = file[0];
                }
                if (file && file._id) { //There's a dynamic file to show
                    return mediaService.getDownloadUrl(file);
                } else if (scope.defaultMediaUrl) { //There's a default file to show
                    return scope.defaultMediaUrl;
                }
                return null;
            };

            scope.getFileTitle = function (file) {
                return mediaService.getMediaHtmlDetails(file);
            };

            scope.selectFile = function () {
                $('input[type="file"]', element).click();
            };

            scope.submit = function () {
                //Submit in progress...
                element.ajaxSubmit({
                    error: function (xhr) {
                        stdService.error('Error uploading file', xhr);
                    },
                    success: function (uploadedFile) {
                        if (scope.model) {
                            scope.model = uploadedFile[0];
                        }
                        scope.$apply();
                        if (scope.onUpload) {
                            scope.onUpload(uploadedFile);
                        }
                        scope.$apply();
                    }
                });
                //It's necessary to return false in order to avoid page refresh
                return false;
            };
		}
	};
}]);
