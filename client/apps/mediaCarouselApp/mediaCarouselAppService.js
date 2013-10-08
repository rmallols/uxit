(function () {
    'use strict';
    COMPONENTS.service('mediaCarouselAppService', ['mediaService', 'timerService',
    function (mediaService, timerService) {

        function view(scope, element) {
            var imgObj = $('img', element), navigatorObj = $('.navigator', element),
                mediaLoaded = false, query = [], mediaIdx, filter;
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
                if (scope.internalData.mediaList
                && scope.internalData.mediaList.length > 0 && index !== undefined) {
                    return mediaService.getDownloadUrl(scope.internalData.mediaList[index]);
                }
                return null;
            };

            scope.setNavigatorCenterPos = function () {
                if (mediaLoaded && scope.internalData.mediaList
                && (scope.model.navigationPos === 'top'
                || scope.model.navigationPos === 'bottom')) {
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
                updateInterval(scope);
            };

            scope.getMediaThumbnailSelectedClass = function (index) {
                return (index === scope.internalData.currentMediaIndex) ? 'selected' : '';
            };

            scope.internalData.changeMedia = function () {
                scope.internalData.currentMediaIndex =
                (scope.internalData.currentMediaIndex < scope.internalData.mediaList.length - 1)
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
        }

        function edit(scope) {
            scope.internalData.originalTimer = scope.model.timer;
            scope.navigationPos = [ {value: 'top', text: 'Top'},
                {value: 'right', text: 'Right'},
                {value: 'bottom', text: 'Bottom'},
                {value: 'left', text: 'Left'}];
            if (!scope.model.navigationPos) {
                scope.model.navigationPos = scope.navigationPos[0].value;
            }
            //noinspection JSUnresolvedVariable

            scope.onLayerSave = function (callback) {

            };
        }

        function onEditSave(scope, callback) {
            //noinspection JSUnresolvedVariable
            if (scope.model.timer !== scope.internalData.originalTimer) {
                updateInterval(scope);
            }
            callback();
        }

        function selectMedia(scope) {
            scope.columns = 1;
        }

        function onSelectMediaSave(scope, callback) {
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
        }

        /** Private methods **/
        function updateInterval(scope) {
            //noinspection JSUnresolvedVariable
            scope.internalData.transitionTimer =
                timerService.updateInterval(scope.internalData.transitionTimer,
                    scope.internalData.changeMedia,
                    scope.model.timer)
        }
        /** End of private methods **/

        return {
            view: view,
            edit: edit,
            onEditSave: onEditSave,
            selectMedia: selectMedia,
            onSelectMediaSave: onSelectMediaSave
        };
    }]);
})();
