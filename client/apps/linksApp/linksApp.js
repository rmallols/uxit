COMPONENTS.directive('linksAppView', function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: '/client/apps/linksApp/linksAppView.html',
        scope: {
            model: '=',
            internalData: '=',
            onLayerSave: '='
        },
		link: function link() {
		}
	};
});