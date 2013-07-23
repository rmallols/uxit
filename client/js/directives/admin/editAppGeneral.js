COMPONENTS.directive('editAppGeneral', [function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: '/client/html/admin/editAppGeneral.html',
        scope: {
            model       : '=',
            onLayerSave : '='
        }
	};
}]);
