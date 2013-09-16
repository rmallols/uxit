COMPONENTS.directive('mediaList', ['$rootScope', 'mediaService', 'constantsService',
function ($rootScope, mediaService, constantsService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
        scope : {
            config: '=',
            onSelect: '='
        },
		templateUrl: 'mediaList.html',
		link: function link(scope) {

            scope.items             = [];
            scope.collection        = constantsService.collections.media;
            //We're interested in the metadata of the image, but not on the binary data
            scope.projection        = { data: 0 };
            scope.searchTargets     = ['name'];
            scope.onSelectPanels    = [{ title: 'Edit media', type: 'editMedia'}];

            scope.$watch('config', function(newConfig) {
                if(newConfig && !newConfig.columns) {
                    newConfig.columns = 4;
                }
            });

            scope.onUpload = function() {
                $rootScope.$broadcast('mediaChanged', 'create'); //Propagate the media create event
                scope.$apply();
            };

            scope.onSelectMedia = function (item, index, selectable) {
                if (!selectable) { //Show the popup just if the item is not selectable
                    scope.popupMediaIndex = index;
                }
                if (scope.onSelect) { scope.onSelect(item); }
            };

            scope.transcludedData = {};
            scope.transcludedData.getDownloadUrl = function (media) {
                return mediaService.getDownloadUrl(media);
            };

            scope.transcludedData.getMediaHtmlDetails = function (media) {
                return mediaService.getMediaHtmlDetails(media);
            };

            scope.transcludedData.showMediaPopup = function (index) {
                scope.popupMediaIndex = index;
            };

            scope.transcludedData.getMediaTitle = function (media) {
                return mediaService.getMediaHtmlDetails(media);
            };
		}
	};
}]);
