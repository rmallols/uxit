COMPONENTS.directive('mapAppView', function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
        scope: {
            model: '=',
            internalData: '=',
            onLayerSave: '='
        },
		templateUrl: '/client/apps/mapApp/mapAppView.html'
	};
});