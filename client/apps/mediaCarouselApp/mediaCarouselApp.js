COMPONENTS.directive('mediaCarouselAppView', function (portalService, mediaService, timerService, constantsService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: 'mediaCarouselAppView.html',
        scope: {
            model: '=',
            internalData: '=',
            onLayerSave: '&'
        },
        link: function link(scope, element) {

            var imgObj = $('img', element), navigatorObj = $('.navigator', element), mediaLoaded = false, query = [],
                mediaIdx, filter;
            scope.internalData.currentMediaIndex = 0;
            for (mediaIdx in scope.model.selectedMedia) {
                if (scope.model.selectedMedia.hasOwnProperty(mediaIdx)) {
                    query.push({ _id : mediaIdx });
                }
            }
            filter = { q : { '$or': query }, projection: { data: 0 } };
            mediaService.getMedia( null, filter, function (mediaList) {
                mediaLoaded = true;
                scope.internalData.mediaList = mediaList.results;
                scope.internalData.goToMedia(scope.internalData.currentMediaIndex);
            });

            scope.getDownloadUrl = function (index) {
                if (scope.internalData.mediaList && scope.internalData.mediaList.length > 0 && index !== undefined) {
                    return mediaService.getDownloadUrl(scope.internalData.mediaList[index]);
                }
                return null;
            };

            scope.setNavigatorCenterPos = function () {
                if (mediaLoaded && scope.internalData.mediaList
                && (scope.model.navigationPos === 'top' || scope.model.navigationPos === 'bottom')) {
                    return {
                        marginLeft : - (navigatorObj.width() / 2)
                    }
                }
                return null;
            };

            scope.internalData.goToMedia = function (index) {
                fadeMediaTransition({
                    onHalf : function () {
                        scope.internalData.currentMediaIndex = index;
                    }
                });
                updateInterval();
            };

            scope.getMediaThumbnailSelectedClass = function (index) {
                return (index === scope.internalData.currentMediaIndex) ? 'selected' : '';
            };

            scope.internalData.changeMedia = function () {
                scope.internalData.currentMediaIndex = (scope.internalData.currentMediaIndex < scope.internalData.mediaList.length - 1)
                    ? scope.internalData.currentMediaIndex + 1
                    : 0;
                fadeMediaTransition();
            };

            function fadeMediaTransition(callbacks) {
                imgObj.animate({
                    opacity: 0
                }, window.speed, function () {
                    if (callbacks && callbacks.onHalf) {
                        callbacks.onHalf();
                    }
                    scope.$apply();
                    $(this).animate({
                        opacity: 1
                    }, window.speed);
                });
            }

            function updateInterval() {
                //noinspection JSUnresolvedVariable
                scope.internalData.transitionTimer = timerService.updateInterval(scope.internalData.transitionTimer,
                                                                                 scope.internalData.changeMedia,
                                                                                 scope.model.timer)
            }
        }
	};
});

COMPONENTS.directive('mediaCarouselAppEdit', function (timerService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'mediaCarouselAppEdit.html',
        scope: {
            model           : '=',
            internalData    : '=',
            onLayerSave     : '&'
        },
        link: function link(scope) {
            scope.navigationPos = [ {value: 'top', text: 'Top'},
                                    {value: 'right', text: 'Right'},
                                    {value: 'bottom', text: 'Bottom'},
                                    {value: 'left', text: 'Left'}];
            if (!scope.model.navigationPos) {
                scope.model.navigationPos = scope.navigationPos[0].value;
            }
            //noinspection JSUnresolvedVariable
            var originalTimer = scope.model.timer;
            scope.onLayerSave = function (callback) {
                //noinspection JSUnresolvedVariable
                if (scope.model.timer !== originalTimer) {
                    scope.internalData.transitionTimer = timerService.updateInterval(scope.internalData.transitionTimer,
                        scope.internalData.changeMedia,
                        scope.model.timer)
                }
                callback();
            };
        }
    };
});

COMPONENTS.directive('mediaCarouselAppSelectMedia', function (mediaService, constantsService) {
    'use strict';
    return {
        restrict: 'A',
        replace: false,
        templateUrl: 'mediaCarouselAppSelectMedia.html',
        scope: {
            model           : '=',
            internalData    : '=',
            onLayerSave     : '='
        },
        link: function link(scope) {
            scope.columns = 1;
            scope.onLayerSave = function (callback) {
                var query = [], filter, mediaIdx;
                for (mediaIdx in scope.model.selectedMedia) {
                    if (scope.model.selectedMedia.hasOwnProperty(mediaIdx)) {
                        query.push({ _id : mediaIdx });
                    }
                }
                filter = { q : { '$or': query } };
                mediaService.getMedia(null, filter, function (mediaList) {
                    scope.internalData.mediaList = mediaList.results;
                    scope.internalData.currentMediaIndex = 0;
                    scope.internalData.goToMedia(scope.internalData.currentMediaIndex);
                });
                callback();
            };
        }
    };
});