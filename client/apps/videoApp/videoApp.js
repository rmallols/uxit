COMPONENTS.directive('videoAppView', function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
        scope: {
            model: '='
        },
		templateUrl: '/client/apps/videoApp/videoAppView.html'
	};
});

COMPONENTS.directive('videoAppEdit', function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        scope: {
            model: '='
        },
        templateUrl: '/client/apps/videoApp/videoAppEdit.html'
    };
});