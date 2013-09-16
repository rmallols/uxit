COMPONENTS.directive('socialAppView', function () {
	'use strict';
    return {
		restrict: 'A',
		replace: true,
		templateUrl: 'socialAppView.html',
        scope: {
            model: '='
        },
        link: function link(scope) {
            if (!scope.model.iconSize) {
                scope.model.iconSize = 'medium';
            }
        }
	};
});

COMPONENTS.directive('socialAppEdit', function () {
    'use strict';
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'socialAppEdit.html',
        scope: {
            model: '=',
            internalData: '='
        },
        link: function link(scope) {
            scope.internalData.iconSizes = [
                { id: 'small',  text: 'Small' },
                { id: 'medium', text: 'Medium' },
                { id: 'big',    text: 'Big' }
            ]
        }
    };
});