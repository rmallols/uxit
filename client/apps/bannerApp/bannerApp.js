'use strict';
COMPONENTS.directive('bannerAppView', ['pageService', function (pageService) {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'bannerAppView.html',
        scope: {
            model: '=',
            internalData: '=',
            onLayerSave: '&'
        },
		link: function link(scope) {
            scope.onModelChange = function() {
                pageService.updateCurrentPage(null);
            }
        }
	};
}]);
