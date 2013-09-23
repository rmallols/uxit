(function () {
    'use strict';
    COMPONENTS.directive('mediaPicker', ['$rootScope', 'editBoxUtilsService', 'mediaService',
    function ($rootScope, editBoxUtilsService, mediaService) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                model           : '=ngModel',
                endpoint        : '@',
                onUpload        : '=',
                onMediaChange   : '=onChange',
                onMediaClose    : '=onClose',
                defaultMediaUrl : '=',
                preview         : '@'
            },
            templateUrl: 'mediaPicker.html',
            link: function link(scope, element) {

                scope.getDownloadUrl = function (file) {
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

                scope.selectFromMediaList = function() {
                    scope.panels = [{ title: 'Media list selection', type: 'mediaListPicker' }];
                    scope.internalData = {
                        media: scope.model
                    };
                    scope.onChange = function() {
                        success(scope.internalData.media);
                    };
                    scope.onClose = function() {
                        if(scope.onMediaClose) {
                            scope.onMediaClose();
                        }
                    };
                    editBoxUtilsService.showEditBox(scope, element, $('button', element));
                };

                scope.deleteSelection = function() {
                    success(null);
                };

                /** Private methods **/
                function success(file) {
                    if (scope.model) {
                        scope.model = file;
                    }
                    if(!$rootScope.$$phase) {
                        scope.$apply();
                    }
                    if (scope.onUpload) {
                        scope.onUpload(file);
                    }
                    if(scope.onMediaChange) {
                        scope.onMediaChange(file);
                    }
                }
                /** End of private methods **/
            }
        };
    }]);

    COMPONENTS.directive('mediaListPicker', [function () {
        return {
            restrict: 'A',
            replace: false,
            template: '<media-list config="config" on-select="onSelect"></media-list>',
            scope: {
                internalData: '=',
                onChange    : '='
            },
            link: function link(scope) {
                scope.config = {
                    selectable  : true,
                    uploadable  : true,
                    columns     : 2
                };
                scope.onSelect = function (media) {
                    scope.internalData.media = media;
                    if (scope.onChange) { scope.onChange(); }
                };
            }
        };
    }]);
})();