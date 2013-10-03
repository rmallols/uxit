COMPONENTS.directive('loginAppView', function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: 'loginAppView.html',
        scope: {
            model: '=',
            internalData: '=',
            onLayerSave : '='
        },
        link: function link() {
        }
	};
});