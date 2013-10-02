COMPONENTS.directive('editAppStyles', [function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: 'editAppStyles.html',
        scope: {
            model       : '=',
            onLayerSave : '&'
        }
	};
}]);
