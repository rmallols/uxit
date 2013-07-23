COMPONENTS.directive('loginAppView', function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: '/client/apps/loginApp/loginAppView.html',
        scope: {
            model: '=',
            internalData: '=',
            onLayerSave: '='
        },
        link: function link() {
        }
	};
});