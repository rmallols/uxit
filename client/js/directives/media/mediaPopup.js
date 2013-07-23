(function (window, Number) {
    'use strict';
    COMPONENTS.directive('mediaPopup', ['mediaService', 'domService', 'stringService', 'keyboardService',
    function (mediaService, domService, stringService, keyboardService) {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/client/html/media/mediaPopup.html',
            scope: {
                mediaIndex  : '=',
                mediaList   : '='
            },
            link: function link(scope, element) {

                var imgObj = $("img", element), headerObj = $(".header", element),
                    imgWrapper = $(".imgWrapper", element), directiveId = 'mediaPopup';

                imgObj.bind("load", function () {

                    function registerKeyboardEvents() {
                        keyboardService.register('left', directiveId, function () {
                            scope.getPrevMedia();
                            scope.$apply();
                        });
                        keyboardService.register('right', directiveId, function () {
                            scope.getNextMedia();
                            scope.$apply();
                        });
                        keyboardService.register('esc', directiveId, function () {
                            scope.closePopup();
                            scope.$apply();
                        });
                    }

                    scope.showPopup = true;
                    scope.isloadingImage = true;
                    scope.$apply();
                    registerKeyboardEvents();
                });

                scope.getDownloadUrl = function () {
                    //noinspection JSValidateTypes
                    scope.isloadingImage = false;
                    if (!stringService.isEmpty(scope.mediaIndex)) {
                        return mediaService.getDownloadUrl(scope.mediaList[scope.mediaIndex]);
                    }
                    return null;
                };

                scope.getMediaHtmlDetails = function () {
                    //noinspection JSValidateTypes
                    if (!stringService.isEmpty(scope.mediaIndex)) {
                        return mediaService.getMediaHtmlDetails(scope.mediaList[scope.mediaIndex]);
                    }
                    return null;
                };

                scope.setCenterPosition = function () {
                    if (scope.showPopup) {
                        var maxAllowedPercent   = 0.7,
                            maxAllowedWidth     = Number($(window).width() * maxAllowedPercent),
                            maxAllowedHeight    = Number($(window).height() * maxAllowedPercent),
                            imgOriginalWidth    = scope.mediaList[scope.mediaIndex].width,
                            imgOriginalHeight   = scope.mediaList[scope.mediaIndex].height,
                            aspectRatio         = imgOriginalWidth / imgOriginalHeight,
                            imgWrapperPadding   = domService.getObjPadding(imgWrapper),
                            imgNormalizedWidth, imgNormalizedHeight;
                        if ((imgOriginalWidth < maxAllowedWidth) && (imgOriginalHeight < maxAllowedHeight)) {
                            imgNormalizedHeight = scope.mediaList[scope.mediaIndex].height;
                            imgNormalizedWidth  = scope.mediaList[scope.mediaIndex].width;
                        } else {
                            if (imgOriginalHeight >= imgOriginalWidth) {
                                imgNormalizedHeight = maxAllowedHeight;
                                imgNormalizedWidth  = imgNormalizedHeight * aspectRatio;
                            } else {
                                imgNormalizedWidth  = maxAllowedWidth;
                                imgNormalizedHeight = imgNormalizedWidth / aspectRatio;
                            }
                        }
                        return {
                            width       : imgNormalizedWidth,
                            height      : imgNormalizedHeight + headerObj.outerHeight(),
                            marginTop   : -(imgNormalizedHeight / 2) - (imgWrapperPadding.top + imgWrapperPadding.bottom),
                            marginLeft  : -(imgNormalizedWidth / 2),
                            visibility  : (scope.showPopup) ? 'visible' : 'hidden'
                        };
                    }
                    return null;
                };

                scope.setNavigationActionsPosition = function () {
                    if (scope.showPopup) {
                        var popupPadding = domService.getObjPadding(imgWrapper);
                        return {
                            marginTop       : headerObj.outerHeight() + popupPadding.top,
                            height          : imgObj.height()
                        };
                    }
                    return null;
                };

                scope.getPrevMedia = function () {
                    if (scope.mediaIndex > 0) {
                        scope.mediaIndex -= 1;
                    }
                };

                scope.getNextMedia = function () {
                    if (scope.mediaIndex < scope.mediaList.length - 1) {
                        scope.mediaIndex += 1;
                    }
                };

                scope.closePopup = function () {

                    function unregisterKeyboardEvents() {
                        keyboardService.unregister('left', directiveId);
                        keyboardService.unregister('right', directiveId);
                        keyboardService.unregister('esc', directiveId);
                    }

                    scope.showPopup = false;
                    scope.mediaIndex = null;
                    unregisterKeyboardEvents();
                };

                scope.getImgWrapperClass = function () {
                    return (scope.isloadingImage) ? 'loading' : '';
                };
            }
        };
    }]);
})(window, window.Number);