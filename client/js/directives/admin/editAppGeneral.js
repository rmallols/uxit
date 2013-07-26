COMPONENTS.directive('editAppGeneral', ['i18nService', function (i18nService) {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: '/client/html/admin/editAppGeneral.html',
        scope: {
            model       : '=',
            onLayerSave : '='
        },
        link: function link(scope) {
            scope.floats = [
                { id: 'left',  text: i18nService('editApp.floatLeft') },
                { id: 'right', text: i18nService('editApp.floatRight') }
            ];
            if(!scope.model.float) {
                scope.model.float = scope.floats[0].id;
            }
        }
	};
}]);
