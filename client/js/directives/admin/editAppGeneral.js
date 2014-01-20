COMPONENTS.directive('editAppGeneral', ['i18nService', function (i18nService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: 'editAppGeneral.html',
        scope: {
            model   : '=',
            onLayer : '='
        }
	};
}]);
