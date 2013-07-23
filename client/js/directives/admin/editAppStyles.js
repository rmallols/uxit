COMPONENTS.directive('editAppStyles', [function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: '/client/html/admin/editAppStyles.html',
        scope: {
            model       : '=',
            onLayerSave : '='
        }
	};
}]);
