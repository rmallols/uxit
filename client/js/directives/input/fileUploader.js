(function() {
    COMPONENTS.directive('fileUploader', ['$rootScope', 'mediaService', 'arrayService', 'stdService', 'editBoxUtilsService',
    function ($rootScope, mediaService, arrayService, stdService, editBoxUtilsService) {
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
                multiple        : '@',
                preview         : '@'
            },
            link: function link(scope, element) {

                var mediaListSelectionObj = $('.mediaListSelection', element);

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

                scope.selectFromMediaList = function() {
                    scope.panels = [{ title: 'Media list selection', type: 'mediaListSelection' }];
                    scope.internalData = {
                        media: scope.model
                    };
                    scope.onChange = function() {
                        success([scope.internalData.media]);
                    };
                    editBoxUtilsService.showEditBox(scope, element, mediaListSelectionObj);
                };

                scope.submit = function () {
                    //Submit in progress...
                    element.ajaxSubmit({
                        error: function (xhr) {
                            stdService.error('Error uploading file', xhr);
                        },
                        success: function (uploadedFile) {
                            success(uploadedFile);
                        }
                    });
                    //It's necessary to return false in order to avoid page refresh
                    return false;
                };

                /** Private methods **/
                function success(file) {
                    if (scope.model) {
                        scope.model = file[0];
                    }
                    if(!$rootScope.$$phase) {
                        scope.$apply();
                    }
                    if (scope.onUpload) {
                        scope.onUpload(file);
                    }
                }
                /** End of private methods **/
            }
        };
    }]);

    COMPONENTS.directive('mediaListSelection', [function () {
        'use strict';
        return {
            restrict: 'A',
            replace: false,
            template: '<media-list config="config" refresh-list="refreshList" on-select="onSelect"></media-list>',
            scope: {
                internalData: '=',
                onChange    : '='
            },
            link: function link(scope) {
                scope.config = {
                    selectable  : true,
                    uploadable  : false,
                    columns     : 2
                };
                scope.refreshList = function () {};
                scope.onSelect = function (media) {
                    scope.internalData.media = media;
                    if (scope.onChange) { scope.onChange(); }
                };
            }
        }
    }]);
})();
