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
            scope.aligns = [
                { id: 'left',   text: i18nService('editApp.alignLeft') },
                { id: 'center', text: i18nService('editApp.alignCenter') },
                { id: 'right',  text: i18nService('editApp.alignRight') }
            ];
            if(!scope.model.align) {
                scope.model.align = scope.aligns[0].id;
            }
        }
	};
}]);
