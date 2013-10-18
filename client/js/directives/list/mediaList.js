COMPONENTS.directive('mediaList', ['$rootScope', 'mediaService', 'constantsService',
function ($rootScope, mediaService, constantsService) {
	'use strict';
    return {
		restrict: 'E',
		replace: true,
        scope : {
            config: '=',
            onSelect: '&'
        },
		templateUrl: 'mediaList.html',
		link: function link(scope) {

            scope.items         = [];
            scope.collection    = constantsService.collections.media;
            //We're interested in the metadata of the image, but not on the binary data
            scope.projection    = { data: 0 };
            scope.searchTargets = ['name'];
            scope.onEditPanels  = [{ title: 'Edit media', type: 'editMedia'}];
            scope.template      = '<img ng-src="{{transcludedData.getDownloadUrl(item)}}" ' +
                                  'title="{{transcludedData.getMediaTitle(item)}}" ' +
                                  'class="cursorPointer" edit-on-click="true" />';

            scope.$watch('config', function(newConfig) {
                newConfig.boxedItems = true;
                if(newConfig && !newConfig.columns) {
                    newConfig.columns = 4;
                }
            });

            scope.onUpload = function() {
                $rootScope.$broadcast('mediaChanged', 'create'); //Propagate the media create event
                scope.$apply();
            };

            scope.transcludedData = {};
            scope.transcludedData.getDownloadUrl = function (media) {
                return mediaService.getDownloadUrl(media);
            };

            scope.transcludedData.getMediaTitle = function (media) {
                return mediaService.getMediaHtmlDetails(media);
            };
		}
	};
}]);
