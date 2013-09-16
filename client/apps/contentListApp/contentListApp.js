COMPONENTS.directive('contentListAppView', function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: 'contentListAppView.html',
        scope: {
            _id: '=id',
            model: '=',
            onLayerSave: '='
        }
	};
});

COMPONENTS.directive('contentListAppAdd', function (contentService) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'contentListAppAdd.html',
        scope : {
            onLayerSave : '='
        },
        link: function link(scope) {
            scope.onLayerSave = function (callback) {
                contentService.createContent(scope.content, function () {
                    callback();
                });
            };
        }
    };
});

COMPONENTS.directive('contentListAppEdit', function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'contentListAppEdit.html'
    };
});