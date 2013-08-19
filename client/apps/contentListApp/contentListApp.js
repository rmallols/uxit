COMPONENTS.directive('contentListAppView', function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: '/client/apps/contentListApp/contentListAppView.html',
        scope: {
            _id: '=id',
            model: '=',
            onLayerSave: '='
        },
		link: function link(scope) {
            scope.refreshList = function () {};
            scope.onLayerSave = function () {
                scope.refreshList();
            };
        }
	};
});

COMPONENTS.directive('contentListAppAdd', function (contentService) {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: '/client/apps/contentListApp/contentListAppAdd.html',
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
        templateUrl: '/client/apps/contentListApp/contentListAppEdit.html'
    };
});