COMPONENTS.directive('videoAppView', function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
        scope: {
            model: '='
        },
		templateUrl: 'videoAppView.html'
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
        templateUrl: 'videoAppEdit.html'
    };
});