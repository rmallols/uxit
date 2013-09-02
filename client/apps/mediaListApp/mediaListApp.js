COMPONENTS.directive('mediaListAppView', function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: '/client/apps/mediaListApp/mediaListAppView.html',
        scope: {
            model: '=',
            onLayerSave: '='
        }
	};
});

COMPONENTS.directive('mediaListAppAdd', function (mediaService) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: '/client/apps/mediaListApp/mediaListAppAdd.html',
        scope : {
            onLayerSave : '='
        },
        link: function link(scope) {
            scope.onLayerSave = function (callback) {
                mediaService.createMedia(scope.media, function () {
                    callback();
                });
            };
        }
    };
});

COMPONENTS.directive('mediaListAppEdit', function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: '/client/apps/mediaListApp/mediaListAppEdit.html'
    };
});