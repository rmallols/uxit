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
		templateUrl: 'mapAppView.html'
	};
});


COMPONENTS.directive('mapAppEdit', function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        scope: {
            model: '='
        },
        templateUrl: 'mapAppEdit.html'
    };
});